import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer, Order, Product, Transaction, ActivityLog } from '../entities';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(ActivityLog)
    private readonly activityLogRepo: Repository<ActivityLog>,
  ) {}

  async findAll(query: QueryCustomerDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const qb = this.customerRepo
      .createQueryBuilder('customer')
      .loadRelationCountAndMap('customer.ordersCount', 'customer.orders');

    if (query.country) {
      qb.andWhere('customer.country = :country', { country: query.country });
    }

    if (query.status) {
      qb.andWhere('customer.status = :status', { status: query.status });
    }

    if (query.debt && query.debt !== 'all') {
      const subQuery = qb
        .subQuery()
        .select('o.customer_id')
        .from(Order, 'o')
        .groupBy('o.customer_id')
        .having(
          query.debt === 'has_debt'
            ? 'SUM(o.total_price) - SUM(o.total_paid) > 0'
            : 'SUM(o.total_price) - SUM(o.total_paid) <= 0',
        )
        .getQuery();

      qb.andWhere(`customer.id IN ${subQuery}`);
    }

    qb.orderBy('customer.createdAt', 'DESC');

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
    const customer = await this.customerRepo.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException('العميل غير موجود');
    }

    return customer;
  }

  async findDetail(id: string) {
    const customer = await this.findOne(id);

    const financials = await this.orderRepo
      .createQueryBuilder('order')
      .select('COUNT(order.id)', 'totalOrders')
      .addSelect('COALESCE(SUM(order.totalPrice), 0)', 'totalRevenue')
      .addSelect('COALESCE(SUM(order.totalPaid), 0)', 'totalPaid')
      .addSelect('COALESCE(SUM(order.commissionAmount), 0)', 'totalCommissions')
      .where('order.customer_id = :id', { id })
      .getRawOne();

    const receivedCommissionsRaw = await this.transactionRepo
      .createQueryBuilder('trx')
      .select('COALESCE(SUM(trx.amount), 0)', 'received')
      .innerJoin('trx.order', 'order')
      .where('order.customer_id = :id', { id })
      .andWhere('trx.payment_type = :type', { type: 'commission' })
      .andWhere('trx.status = :status', { status: 'confirmed' })
      .getRawOne();

    const totalOrders = Number(financials.totalOrders) || 0;
    const totalRevenue = Number(financials.totalRevenue) || 0;
    const totalPaid = Number(financials.totalPaid) || 0;
    const totalCommissions = Number(financials.totalCommissions) || 0;
    const receivedCommissions = Number(receivedCommissionsRaw?.received) || 0;
    const outstandingDebt = totalRevenue - totalPaid;

    const recentOrders = await this.orderRepo.find({
      where: { customerId: id },
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['product'],
    });

    const topProducts = await this.orderRepo
      .createQueryBuilder('order')
      .select('order.product_id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('product.nameAr', 'productNameAr')
      .addSelect('product.image', 'productImage')
      .addSelect('COUNT(order.id)', 'orderCount')
      .addSelect('SUM(order.totalPrice)', 'totalValue')
      .addSelect('AVG(order.quantity)', 'avgQuantity')
      .innerJoin('order.product', 'product')
      .where('order.customer_id = :id', { id })
      .andWhere('order.product_id IS NOT NULL')
      .groupBy('order.product_id')
      .addGroupBy('product.name')
      .addGroupBy('product.nameAr')
      .addGroupBy('product.image')
      .orderBy('COUNT(order.id)', 'DESC')
      .limit(5)
      .getRawMany();

    const recentPayments = await this.transactionRepo
      .createQueryBuilder('trx')
      .innerJoin('trx.order', 'order')
      .select(['trx.id', 'trx.amount', 'trx.paymentType', 'trx.paymentDate', 'trx.status', 'order.displayId'])
      .where('order.customer_id = :id', { id })
      .orderBy('trx.createdAt', 'DESC')
      .limit(5)
      .getRawMany();

    const activityLogs = await this.activityLogRepo.find({
      where: { entityType: 'customer', entityId: id },
      order: { createdAt: 'DESC' },
      take: 20,
      relations: ['user']
    });

    return {
      ...customer,
      financials: {
        totalOrders,
        totalRevenue,
        totalPaid,
        outstandingDebt,
        totalCommissions,
        receivedCommissions
      },
      recentOrders,
      topProducts,
      recentPayments: recentPayments.map(p => ({
        id: p.trx_id,
        amount: p.trx_amount,
        type: p.trx_payment_type,
        date: p.trx_payment_date,
        status: p.trx_status,
        orderDisplayId: p.order_display_id,
      })),
      activityLogs,
    };
  }

  async addNote(id: string, note: string, userId?: string) {
    const customer = await this.findOne(id);
    const log = this.activityLogRepo.create({
      action: 'note',
      title: 'إضافة ملاحظة',
      details: note,
      entityType: 'customer',
      entityId: id,
      userId: userId,
    });
    await this.activityLogRepo.save(log);
    return this.findDetail(id);
  }

  async create(dto: CreateCustomerDto) {
    const displayId = await this.generateDisplayId();

    const customer = this.customerRepo.create({
      ...dto,
      displayId,
    });

    const saved = await this.customerRepo.save(customer);
    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.findOne(id);

    Object.assign(customer, dto);
    await this.customerRepo.save(customer);
    return this.findOne(id);
  }

  async updateStatus(id: string, status: 'active' | 'inactive') {
    const customer = await this.findOne(id);
    customer.status = status;
    await this.customerRepo.save(customer);
    return this.findOne(id);
  }

  private async generateDisplayId(): Promise<string> {
    const lastCustomer = await this.customerRepo
      .createQueryBuilder('customer')
      .orderBy('customer.createdAt', 'DESC')
      .getOne();

    let nextNumber = 1;
    if (lastCustomer?.displayId) {
      const match = lastCustomer.displayId.match(/CLI-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    return `CLI-${String(nextNumber).padStart(5, '0')}`;
  }
}
