import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Order,
  Transaction,
  Attachment,
  OrderStageHistory,
  WorkflowStage,
  Customer,
  Product,
} from '../entities';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { AddPaymentDto } from './dto/add-payment.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
    @InjectRepository(OrderStageHistory)
    private readonly stageHistoryRepo: Repository<OrderStageHistory>,
    @InjectRepository(WorkflowStage)
    private readonly workflowStageRepo: Repository<WorkflowStage>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(query: QueryOrderDto) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(query.limit || '10', 10)));
    const skip = (page - 1) * limit;

    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.product', 'product');

    if (query.client) {
      qb.andWhere(
        '(customer.name ILIKE :client OR customer.displayId ILIKE :client)',
        { client: `%${query.client}%` },
      );
    }

    if (query.product) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(query.product);
      if (isUUID) {
        qb.andWhere('product.id = :productId', { productId: query.product });
      } else {
        qb.andWhere(
          '(product.name ILIKE :product OR product.displayId ILIKE :product)',
          { product: `%${query.product}%` },
        );
      }
    }

    if (query.stage) {
      qb.andWhere('order.currentStage = :stage', { stage: query.stage });
    }

    if (query.date) {
      qb.andWhere('DATE(order.createdAt) = :date', { date: query.date });
    }

    if (query.priority) {
      qb.andWhere('order.priority = :priority', { priority: query.priority });
    }

    qb.orderBy('order.createdAt', 'DESC').skip(skip).take(limit);

    const [data, totalItems] = await qb.getManyAndCount();

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    };
  }

  async findOne(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: [
        'customer',
        'product',
        'createdBy',
        'transactions',
        'transactions.addedBy',
        'attachments',
        'stageHistory',
        'stageHistory.changedBy',
      ],
    });

    if (!order) {
      throw new NotFoundException('الطلب غير موجود');
    }

    return order;
  }

  async create(dto: CreateOrderDto, userId: string) {
    const customer = await this.customerRepo.findOne({
      where: { id: dto.customerId },
    });
    if (!customer) {
      throw new BadRequestException('العميل غير موجود');
    }

    if (dto.productId) {
      const product = await this.productRepo.findOne({
        where: { id: dto.productId },
      });
      if (!product) {
        throw new BadRequestException('المنتج غير موجود');
      }
    }

    const displayId = await this.generateDisplayId();

    const totalPrice = dto.quantity * dto.unitPrice;
    const commissionAmount = totalPrice * dto.commissionRate / 100;
    const firstPayment = dto.firstPayment ?? 0;
    const remainingBalance = totalPrice - firstPayment;

    const order = this.orderRepo.create({
      displayId,
      quantity: dto.quantity,
      unitPrice: dto.unitPrice,
      totalPrice,
      currency: dto.currency ?? 'EGP',
      commissionRate: dto.commissionRate,
      commissionAmount,
      firstPayment,
      totalPaid: firstPayment,
      remainingBalance,
      currentStage: 'عرض السعر',
      status: 'active' as const,
      priority: (dto.priority as any) ?? 'medium',
      notes: dto.notes,
      customerId: dto.customerId,
      productId: dto.productId,
      createdById: userId,
    });

    const savedOrder = await this.orderRepo.save(order);

    if (firstPayment > 0) {
      const txDisplayId = await this.generateTransactionDisplayId();
      const transaction = this.transactionRepo.create({
        displayId: txDisplayId,
        paymentType: 'first_payment' as const,
        amount: firstPayment,
        currency: savedOrder.currency,
        paymentDate: new Date(),
        notes: 'دفعة أولى عند إنشاء الطلب',
        status: 'confirmed' as const,
        orderId: savedOrder.id,
        addedById: userId,
      });
      await this.transactionRepo.save(transaction);
    }

    const stageHistory = this.stageHistoryRepo.create({
      toStage: 'عرض السعر',
      reason: 'إنشاء طلب جديد',
      orderId: savedOrder.id,
      changedById: userId,
    });
    await this.stageHistoryRepo.save(stageHistory);

    this.notificationsService.notifyAdmins({
      type: 'order_created',
      message: `تم إضافة طلب جديد: ${displayId}`,
      referenceId: savedOrder.id,
      referenceType: 'order',
    }).catch(console.error);

    return this.findOne(savedOrder.id);
  }

  async update(id: string, dto: UpdateOrderDto) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('الطلب غير موجود');
    }

    if (dto.customerId) order.customerId = dto.customerId;
    if (dto.productId) order.productId = dto.productId;
    if (dto.currency) order.currency = dto.currency;
    if (dto.notes !== undefined) order.notes = dto.notes;
    if (dto.priority) order.priority = dto.priority as any;

    // Recalculate financials if quantity or unitPrice changed
    if (dto.quantity !== undefined) order.quantity = dto.quantity;
    if (dto.unitPrice !== undefined) order.unitPrice = dto.unitPrice;
    if (dto.commissionRate !== undefined) order.commissionRate = dto.commissionRate;

    const totalPrice = order.quantity * order.unitPrice;
    order.totalPrice = totalPrice;
    order.commissionAmount = totalPrice * order.commissionRate / 100;
    order.remainingBalance = totalPrice - Number(order.totalPaid);

    await this.orderRepo.save(order);
    return this.findOne(id);
  }

  async updateStage(id: string, dto: UpdateStageDto, userId: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('الطلب غير موجود');
    }

    const currentWorkflowStage = await this.workflowStageRepo.findOne({
      where: { title: order.currentStage, isActive: true },
    });

    const newWorkflowStage = await this.workflowStageRepo.findOne({
      where: { title: dto.newStage, isActive: true },
    });

    if (!newWorkflowStage) {
      throw new BadRequestException('المرحلة الجديدة غير موجودة أو غير مفعّلة');
    }

    if (
      currentWorkflowStage &&
      newWorkflowStage.sortOrder <= currentWorkflowStage.sortOrder
    ) {
      throw new BadRequestException(
        'لا يمكن الرجوع لمرحلة سابقة. يجب أن تكون المرحلة الجديدة بعد المرحلة الحالية',
      );
    }

    const stageHistory = this.stageHistoryRepo.create({
      fromStage: order.currentStage,
      toStage: dto.newStage,
      reason: dto.reason,
      orderId: order.id,
      changedById: userId,
    });
    await this.stageHistoryRepo.save(stageHistory);

    order.currentStage = dto.newStage;
    await this.orderRepo.save(order);

    this.notificationsService.notifyAdmins({
      type: 'stage_updated',
      message: `تم تحديث مرحلة الطلب ${order.displayId} إلى ${dto.newStage}`,
      referenceId: order.id,
      referenceType: 'order',
    }).catch(console.error);

    return this.findOne(id);
  }

  async addPayment(id: string, dto: AddPaymentDto, userId: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('الطلب غير موجود');
    }

    const txDisplayId = await this.generateTransactionDisplayId();
    const transaction = this.transactionRepo.create({
      displayId: txDisplayId,
      paymentType: dto.paymentType,
      amount: dto.amount,
      currency: dto.currency ?? order.currency,
      paymentDate: dto.paymentDate as unknown as Date,
      notes: dto.notes,
      status: 'pending' as const,
      orderId: order.id,
      addedById: userId,
    });
    const savedTx = await this.transactionRepo.save(transaction);

    order.totalPaid = Number(order.totalPaid) + dto.amount;
    order.remainingBalance = Number(order.totalPrice) - order.totalPaid;
    await this.orderRepo.save(order);

    this.notificationsService.notifyAdmins({
      type: 'payment_added',
      message: `تم إضافة دفعة جديدة بمبلغ ${dto.amount} للطلب ${order.displayId}`,
      referenceId: savedTx.id,
      referenceType: 'transaction',
    }).catch(console.error);

    return { ...(await this.findOne(id)), newTransactionId: savedTx.id };
  }

  async uploadProof(orderId: string, txId: string, file: Express.Multer.File) {
    const tx = await this.transactionRepo.findOne({
      where: { id: txId, orderId },
    });
    if (!tx) {
      throw new NotFoundException('الدفعة غير موجودة');
    }
    tx.proofFile = file.filename;
    await this.transactionRepo.save(tx);
    return this.findOne(orderId);
  }

  async addAttachment(
    orderId: string,
    file: Express.Multer.File,
  ) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('الطلب غير موجود');
    }

    const attachment = this.attachmentRepo.create({
      fileName: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileType: file.mimetype,
      fileSize: file.size,
      orderId,
    });

    return this.attachmentRepo.save(attachment);
  }

  async removeAttachment(orderId: string, attachId: string) {
    const attachment = await this.attachmentRepo.findOne({
      where: { id: attachId, orderId },
    });

    if (!attachment) {
      throw new NotFoundException('المرفق غير موجود');
    }

    await this.attachmentRepo.remove(attachment);

    return { message: 'تم حذف المرفق بنجاح' };
  }

  private async generateDisplayId(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `ORD-${year}-`;

    const lastOrder = await this.orderRepo
      .createQueryBuilder('order')
      .where('order.displayId LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('order.displayId', 'DESC')
      .getOne();

    let seq = 1;
    if (lastOrder) {
      const lastSeq = parseInt(lastOrder.displayId.replace(prefix, ''), 10);
      if (!isNaN(lastSeq)) {
        seq = lastSeq + 1;
      }
    }

    return `${prefix}${seq.toString().padStart(3, '0')}`;
  }

  private async generateTransactionDisplayId(): Promise<string> {
    const lastTx = await this.transactionRepo
      .createQueryBuilder('tx')
      .orderBy('tx.createdAt', 'DESC')
      .getOne();

    let seq = 1;
    if (lastTx && lastTx.displayId) {
      const lastSeq = parseInt(lastTx.displayId.replace('TRX-', ''), 10);
      if (!isNaN(lastSeq)) {
        seq = lastSeq + 1;
      }
    }

    return `TRX-${seq.toString().padStart(6, '0')}`;
  }
}
