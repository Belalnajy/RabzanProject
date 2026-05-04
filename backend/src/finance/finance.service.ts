import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Transaction } from '../entities/transaction.entity';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
  ) {}

  async getOverview(query: {
    status?: string;
    product?: string;
    client?: string;
    date?: string;
    page?: string;
    limit?: string;
  }) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.product', 'product');

    if (query.status) {
      qb.andWhere('order.status = :status', { status: query.status });
    }

    if (query.product) {
      qb.andWhere('order.productId = :productId', { productId: query.product });
    }

    if (query.client) {
      qb.andWhere('order.customerId = :customerId', { customerId: query.client });
    }

    if (query.date) {
      qb.andWhere('DATE(order.createdAt) = :date', { date: query.date });
    }

    qb.orderBy('order.createdAt', 'DESC');

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

  async getStats() {
    const orderStats = await this.orderRepo
      .createQueryBuilder('order')
      .select('COALESCE(SUM(order.totalPrice), 0)', 'totalRevenue')
      .addSelect('COALESCE(SUM(order.totalPaid), 0)', 'totalPaid')
      .addSelect('COALESCE(SUM(order.remainingBalance), 0)', 'totalDue')
      .addSelect('COALESCE(SUM(order.commissionAmount), 0)', 'commissionsGenerated')
      .where('order.status != :cancelled', { cancelled: 'cancelled' })
      .getRawOne();

    const commissionReceived = await this.transactionRepo
      .createQueryBuilder('trx')
      .select('COALESCE(SUM(trx.amount), 0)', 'received')
      .where('trx.paymentType = :type', { type: 'commission' })
      .andWhere('trx.status != :voided', { voided: 'voided' })
      .getRawOne();

    const commissionsReceived = parseFloat(commissionReceived?.received || '0');
    const commissionsGenerated = parseFloat(orderStats?.commissionsGenerated || '0');

    return {
      totalRevenue: parseFloat(orderStats?.totalRevenue || '0'),
      totalPaid: parseFloat(orderStats?.totalPaid || '0'),
      totalDue: parseFloat(orderStats?.totalDue || '0'),
      commissionsGenerated,
      commissionsReceived,
      commissionsPending: commissionsGenerated - commissionsReceived,
    };
  }

  async getRevenueChart() {
    const result = await this.orderRepo
      .createQueryBuilder('order')
      .select("TO_CHAR(order.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COALESCE(SUM(order.totalPrice), 0)', 'revenue')
      .where('order.status != :cancelled', { cancelled: 'cancelled' })
      .andWhere('order.createdAt >= NOW() - INTERVAL \'12 months\'')
      .groupBy("TO_CHAR(order.createdAt, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();

    return result.map((r) => ({
      month: r.month,
      revenue: parseFloat(r.revenue),
    }));
  }

  async getPaidVsDueChart() {
    const result = await this.orderRepo
      .createQueryBuilder('order')
      .select("TO_CHAR(order.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COALESCE(SUM(order.totalPaid), 0)', 'paid')
      .addSelect('COALESCE(SUM(order.remainingBalance), 0)', 'due')
      .where('order.status != :cancelled', { cancelled: 'cancelled' })
      .groupBy("TO_CHAR(order.createdAt, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();

    return result.map((r) => ({
      month: r.month,
      paid: parseFloat(r.paid),
      due: parseFloat(r.due),
    }));
  }

  async getStatusDistribution() {
    const result = await this.orderRepo
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(order.id)', 'count')
      .groupBy('order.status')
      .getRawMany();

    return result.map((r) => ({
      status: r.status,
      count: parseInt(r.count, 10),
    }));
  }

  async getRecentTransactions() {
    return this.transactionRepo.find({
      relations: ['order', 'order.customer', 'addedBy'],
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  async getCommissionTracking(query: { page?: string; limit?: string }) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.product', 'product')
      .where('order.commissionAmount > 0')
      .orderBy('order.createdAt', 'DESC');

    const [data, totalItems] = await qb.skip(skip).take(limit).getManyAndCount();

    const ordersWithCommissionPaid = await Promise.all(
      data.map(async (order) => {
        const result = await this.transactionRepo
          .createQueryBuilder('trx')
          .select('COALESCE(SUM(trx.amount), 0)', 'paid')
          .where('trx.orderId = :orderId', { orderId: order.id })
          .andWhere('trx.paymentType = :type', { type: 'commission' })
          .andWhere('trx.status != :voided', { voided: 'voided' })
          .getRawOne();

        return {
          ...order,
          commissionPaid: parseFloat(result?.paid || '0'),
          commissionRemaining:
            parseFloat(String(order.commissionAmount)) -
            parseFloat(result?.paid || '0'),
        };
      }),
    );

    return {
      data: ordersWithCommissionPaid,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    };
  }
}
