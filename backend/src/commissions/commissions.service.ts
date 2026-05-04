import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class CommissionsService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  async findAll(query: { page?: string; limit?: string }) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.product', 'product')
      .where('order.commissionAmount > 0')
      .orderBy('order.createdAt', 'DESC');

    const [orders, totalItems] = await qb.skip(skip).take(limit).getManyAndCount();

    const data = await Promise.all(
      orders.map(async (order) => {
        const result = await this.transactionRepo
          .createQueryBuilder('trx')
          .select('COALESCE(SUM(trx.amount), 0)', 'received')
          .where('trx.orderId = :orderId', { orderId: order.id })
          .andWhere('trx.paymentType = :type', { type: 'commission' })
          .andWhere('trx.status != :voided', { voided: 'voided' })
          .getRawOne();

        const received = parseFloat(result?.received || '0');

        return {
          ...order,
          commissionReceived: received,
          commissionRemaining:
            parseFloat(String(order.commissionAmount)) - received,
        };
      }),
    );

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

  async findByOrder(orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['customer', 'product'],
    });

    if (!order) {
      throw new NotFoundException('الطلب غير موجود');
    }

    const commissionTransactions = await this.transactionRepo.find({
      where: { orderId, paymentType: 'commission' },
      relations: ['addedBy'],
      order: { createdAt: 'DESC' },
    });

    const receivedResult = await this.transactionRepo
      .createQueryBuilder('trx')
      .select('COALESCE(SUM(trx.amount), 0)', 'received')
      .where('trx.orderId = :orderId', { orderId })
      .andWhere('trx.paymentType = :type', { type: 'commission' })
      .andWhere('trx.status != :voided', { voided: 'voided' })
      .getRawOne();

    const received = parseFloat(receivedResult?.received || '0');
    const commissionAmount = parseFloat(String(order.commissionAmount));

    return {
      order: {
        id: order.id,
        displayId: order.displayId,
        totalPrice: order.totalPrice,
        commissionRate: order.commissionRate,
        commissionAmount: order.commissionAmount,
        status: order.status,
        customer: order.customer,
        product: order.product,
      },
      commission: {
        total: commissionAmount,
        received,
        remaining: commissionAmount - received,
      },
      payments: commissionTransactions,
    };
  }

  async getStats() {
    const totalCommissions = await this.orderRepo
      .createQueryBuilder('order')
      .select('COALESCE(SUM(order.commissionAmount), 0)', 'total')
      .where('order.status != :cancelled', { cancelled: 'cancelled' })
      .getRawOne();

    const receivedCommissions = await this.transactionRepo
      .createQueryBuilder('trx')
      .select('COALESCE(SUM(trx.amount), 0)', 'received')
      .where('trx.paymentType = :type', { type: 'commission' })
      .andWhere('trx.status != :voided', { voided: 'voided' })
      .getRawOne();

    const total = parseFloat(totalCommissions?.total || '0');
    const received = parseFloat(receivedCommissions?.received || '0');

    return {
      totalCommissions: total,
      receivedCommissions: received,
      remainingCommissions: total - received,
    };
  }
}
