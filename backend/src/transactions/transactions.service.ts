import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Transaction } from '../entities/transaction.entity';
import { ActivityLog } from '../entities/activity-log.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(ActivityLog)
    private activityLogRepo: Repository<ActivityLog>,
    private readonly notificationsService: NotificationsService,
    private dataSource: DataSource,
  ) {}

  async findAll(query: QueryTransactionDto) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const qb = this.transactionRepo
      .createQueryBuilder('trx')
      .leftJoinAndSelect('trx.order', 'order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('trx.addedBy', 'addedBy');

    if (query.paymentType) {
      qb.andWhere('trx.paymentType = :paymentType', {
        paymentType: query.paymentType,
      });
    }

    if (query.status) {
      qb.andWhere('trx.status = :status', { status: query.status });
    }

    if (query.client) {
      qb.andWhere('customer.id = :customerId', {
        customerId: query.client,
      });
    }

    if (query.dateRange) {
      const [startDate, endDate] = query.dateRange.split(',');
      if (startDate && endDate) {
        qb.andWhere('trx.paymentDate BETWEEN :startDate AND :endDate', {
          startDate: startDate.trim(),
          endDate: endDate.trim(),
        });
      }
    }

    qb.orderBy('trx.createdAt', 'DESC');

    const [data, totalItems] = await qb.skip(skip).take(limit).getManyAndCount();

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
    const transaction = await this.transactionRepo.findOne({
      where: { id },
      relations: [
        'order',
        'order.customer',
        'order.product',
        'addedBy',
      ],
    });

    if (!transaction) {
      throw new NotFoundException('المعاملة غير موجودة');
    }

    return transaction;
  }

  async create(dto: CreateTransactionDto, userId?: string) {
    const order = await this.orderRepo.findOne({
      where: { id: dto.orderId },
      relations: ['customer'],
    });

    if (!order) {
      throw new NotFoundException('الطلب غير موجود');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const displayId = await this.generateDisplayId();

      const transaction = this.transactionRepo.create({
        displayId,
        paymentType: dto.paymentType,
        amount: dto.amount,
        currency: dto.currency || order.currency,
        paymentDate: dto.paymentDate,
        notes: dto.notes,
        orderId: dto.orderId,
        addedById: userId,
      });

      const savedTransaction = await queryRunner.manager.save(transaction);

      if (dto.paymentType !== 'commission') {
        const newTotalPaid =
          parseFloat(String(order.totalPaid)) + dto.amount;
        const newRemainingBalance =
          parseFloat(String(order.totalPrice)) - newTotalPaid;

        await queryRunner.manager.update(Order, order.id, {
          totalPaid: newTotalPaid,
          remainingBalance: Math.max(0, newRemainingBalance),
        });
      }

      const activityLog = this.activityLogRepo.create({
        action: 'create',
        title: `تم إضافة معاملة ${displayId}`,
        details: `تم إضافة دفعة بمبلغ ${dto.amount} للطلب ${order.displayId}`,
        entityType: 'transaction',
        entityId: savedTransaction.id,
        userId,
      });

      await queryRunner.manager.save(activityLog);
      await queryRunner.commitTransaction();

      this.notificationsService.notifyAdmins({
        type: 'payment_added',
        message: `تم إضافة دفعة جديدة بمبلغ ${dto.amount} للطلب ${order.displayId}`,
        referenceId: savedTransaction.id,
        referenceType: 'transaction',
      }).catch(console.error);

      return savedTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, dto: UpdateTransactionDto, userId?: string) {
    const transaction = await this.transactionRepo.findOne({
      where: { id },
      relations: ['order'],
    });

    if (!transaction) {
      throw new NotFoundException('المعاملة غير موجودة');
    }

    if (transaction.status !== 'pending') {
      throw new BadRequestException('لا يمكن تعديل معاملة غير معلّقة');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const oldAmount = parseFloat(String(transaction.amount));
      const newAmount = dto.amount !== undefined ? dto.amount : oldAmount;
      const amountDiff = newAmount - oldAmount;

      Object.assign(transaction, dto);
      const updated = await queryRunner.manager.save(transaction);

      if (amountDiff !== 0 && transaction.paymentType !== 'commission') {
        const order = transaction.order;
        const newTotalPaid =
          parseFloat(String(order.totalPaid)) + amountDiff;
        const newRemainingBalance =
          parseFloat(String(order.totalPrice)) - newTotalPaid;

        await queryRunner.manager.update(Order, order.id, {
          totalPaid: newTotalPaid,
          remainingBalance: Math.max(0, newRemainingBalance),
        });
      }

      const activityLog = this.activityLogRepo.create({
        action: 'update',
        title: `تم تعديل معاملة ${transaction.displayId}`,
        details: `تم تعديل بيانات المعاملة ${transaction.displayId}`,
        entityType: 'transaction',
        entityId: transaction.id,
        userId,
      });

      await queryRunner.manager.save(activityLog);
      await queryRunner.commitTransaction();

      return updated;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async void(id: string, reason: string, userId?: string) {
    const transaction = await this.transactionRepo.findOne({
      where: { id },
      relations: ['order'],
    });

    if (!transaction) {
      throw new NotFoundException('المعاملة غير موجودة');
    }

    if (transaction.status === 'voided') {
      throw new BadRequestException('المعاملة ملغية بالفعل');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      transaction.status = 'voided';
      transaction.voidReason = reason;
      await queryRunner.manager.save(transaction);

      if (transaction.paymentType !== 'commission') {
        const order = transaction.order;
        const reversedAmount = parseFloat(String(transaction.amount));
        const newTotalPaid =
          parseFloat(String(order.totalPaid)) - reversedAmount;
        const newRemainingBalance =
          parseFloat(String(order.totalPrice)) - newTotalPaid;

        await queryRunner.manager.update(Order, order.id, {
          totalPaid: Math.max(0, newTotalPaid),
          remainingBalance: Math.max(0, newRemainingBalance),
        });
      }

      const activityLog = this.activityLogRepo.create({
        action: 'void',
        title: `تم إلغاء معاملة ${transaction.displayId}`,
        details: `سبب الإلغاء: ${reason}`,
        entityType: 'transaction',
        entityId: transaction.id,
        userId,
      });

      await queryRunner.manager.save(activityLog);
      await queryRunner.commitTransaction();

      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getReceipt(id: string) {
    const transaction = await this.transactionRepo.findOne({
      where: { id },
      relations: ['order', 'order.customer', 'order.product', 'addedBy'],
    });

    if (!transaction) {
      throw new NotFoundException('المعاملة غير موجودة');
    }

    return {
      transactionId: transaction.displayId,
      paymentType: transaction.paymentType,
      amount: transaction.amount,
      currency: transaction.currency,
      paymentDate: transaction.paymentDate,
      status: transaction.status,
      notes: transaction.notes,
      order: {
        displayId: transaction.order.displayId,
        totalPrice: transaction.order.totalPrice,
        totalPaid: transaction.order.totalPaid,
        remainingBalance: transaction.order.remainingBalance,
      },
      customer: {
        name: transaction.order.customer?.name,
        country: transaction.order.customer?.country,
      },
      product: transaction.order.product
        ? { name: (transaction.order.product as any).name }
        : null,
      addedBy: transaction.addedBy
        ? { fullName: (transaction.addedBy as any).fullName }
        : null,
      createdAt: transaction.createdAt,
    };
  }

  async getActivityLog(query: { page?: string; limit?: string }) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.activityLogRepo.findAndCount({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

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

  private async generateDisplayId(): Promise<string> {
    const lastTransaction = await this.transactionRepo
      .createQueryBuilder('trx')
      .orderBy('trx.createdAt', 'DESC')
      .getOne();

    let nextNumber = 1;
    if (lastTransaction?.displayId) {
      const match = lastTransaction.displayId.match(/TRX-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    return `TRX-${String(nextNumber).padStart(6, '0')}`;
  }
}
