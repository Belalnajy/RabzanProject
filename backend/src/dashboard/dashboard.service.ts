import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async getStats() {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      activeOrdersCurrent,
      activeOrdersPrevious,
      revenueCurrentRaw,
      revenuePreviousRaw,
      pendingCommissionsRaw,
      delayedShipments,
      delayedShipmentsNew,
    ] = await Promise.all([
      this.orderRepository.count({
        where: { status: 'active', createdAt: Between(currentMonthStart, now) },
      }),
      this.orderRepository.count({
        where: { status: 'active', createdAt: Between(previousMonthStart, previousMonthEnd) },
      }),
      this.transactionRepository
        .createQueryBuilder('t')
        .select('COALESCE(SUM(t.amount), 0)', 'total')
        .where('t.status = :status', { status: 'confirmed' })
        .andWhere('t.created_at >= :start', { start: currentMonthStart })
        .andWhere('t.created_at <= :end', { end: now })
        .getRawOne(),
      this.transactionRepository
        .createQueryBuilder('t')
        .select('COALESCE(SUM(t.amount), 0)', 'total')
        .where('t.status = :status', { status: 'confirmed' })
        .andWhere('t.created_at >= :start', { start: previousMonthStart })
        .andWhere('t.created_at <= :end', { end: previousMonthEnd })
        .getRawOne(),
      this.orderRepository
        .createQueryBuilder('o')
        .select('COALESCE(SUM(o.commission_amount), 0)', 'total')
        .where('o.status = :status', { status: 'active' })
        .getRawOne(),
      this.orderRepository.count({
        where: { currentStage: 'تأخير الشحن' },
      }),
      // Count delayed shipments created in the last 24 hours
      this.orderRepository.count({
        where: {
          currentStage: 'تأخير الشحن',
          updatedAt: MoreThanOrEqual(yesterday),
        },
      }),
    ]);

    const revenueCurrent = parseFloat(revenueCurrentRaw?.total) || 0;
    const revenuePrevious = parseFloat(revenuePreviousRaw?.total) || 0;

    return {
      activeOrders: {
        count: activeOrdersCurrent,
        trend: this.calcTrend(activeOrdersCurrent, activeOrdersPrevious),
      },
      monthlyRevenue: {
        sum: revenueCurrent,
        trend: this.calcTrend(revenueCurrent, revenuePrevious),
      },
      pendingCommissions: {
        sum: parseFloat(pendingCommissionsRaw?.total) || 0,
      },
      delayedShipments: {
        count: delayedShipments,
        newCount: delayedShipmentsNew,
      },
    };
  }

  async getPipeline() {
    const rows: { stage: string; count: string }[] = await this.orderRepository
      .createQueryBuilder('o')
      .select('o.current_stage', 'stage')
      .addSelect('COUNT(*)', 'count')
      .where('o.status = :status', { status: 'active' })
      .groupBy('o.current_stage')
      .getRawMany();

    const total = rows.reduce((sum, r) => sum + parseInt(r.count, 10), 0);

    return rows.map((r) => ({
      stage: r.stage,
      count: parseInt(r.count, 10),
      percentage: total > 0 ? Math.round((parseInt(r.count, 10) / total) * 100) : 0,
    }));
  }

  async getRecentOrders() {
    return this.orderRepository.find({
      relations: ['customer', 'product'],
      order: { createdAt: 'DESC' },
      take: 10,
      select: {
        id: true,
        displayId: true,
        createdAt: true,
        totalPrice: true,
        currentStage: true,
        currency: true,
        customer: { id: true, name: true },
        product: { id: true, name: true, nameAr: true },
      },
    });
  }

  async getSparklines() {
    const now = new Date();
    const daysCount = 10;

    // Build date strings for current & previous periods
    const currentDates: string[] = [];
    const prevDates: string[] = [];
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      currentDates.push(d.toISOString().split('T')[0]);
    }
    for (let i = daysCount * 2 - 1; i >= daysCount; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      prevDates.push(d.toISOString().split('T')[0]);
    }

    const currentStart = currentDates[0];
    const currentEnd = currentDates[currentDates.length - 1];
    const prevStart = prevDates[0];
    const prevEnd = prevDates[prevDates.length - 1];

    const [
      ordersCurr, ordersPrev,
      revenueCurr, revenuePrev,
      commCurr, commPrev,
      delayedCurr, delayedPrev,
    ] = await Promise.all([
      // Active orders created per day
      this.dailyCount(
        this.orderRepository, 'o', 'o.created_at',
        `o.status = 'active'`, currentStart, currentEnd,
      ),
      this.dailyCount(
        this.orderRepository, 'o', 'o.created_at',
        `o.status = 'active'`, prevStart, prevEnd,
      ),
      // Revenue per day
      this.dailySum(
        this.transactionRepository, 't', 't.created_at', 't.amount',
        `t.status = 'confirmed'`, currentStart, currentEnd,
      ),
      this.dailySum(
        this.transactionRepository, 't', 't.created_at', 't.amount',
        `t.status = 'confirmed'`, prevStart, prevEnd,
      ),
      // Commission amount per day (from orders)
      this.dailySum(
        this.orderRepository, 'o', 'o.created_at', 'o.commission_amount',
        `o.status = 'active'`, currentStart, currentEnd,
      ),
      this.dailySum(
        this.orderRepository, 'o', 'o.created_at', 'o.commission_amount',
        `o.status = 'active'`, prevStart, prevEnd,
      ),
      // Delayed shipments per day
      this.dailyCount(
        this.orderRepository, 'o', 'o.updated_at',
        `o.current_stage = 'تأخير الشحن'`, currentStart, currentEnd,
      ),
      this.dailyCount(
        this.orderRepository, 'o', 'o.updated_at',
        `o.current_stage = 'تأخير الشحن'`, prevStart, prevEnd,
      ),
    ]);

    const fill = (rows: { day: string; val: string }[], dates: string[]) => {
      const map = new Map(rows.map(r => [r.day, parseFloat(r.val) || 0]));
      return dates.map(d => map.get(d) || 0);
    };

    return {
      dates: { current: currentDates, previous: prevDates },
      orders:      { current: fill(ordersCurr, currentDates),  previous: fill(ordersPrev, prevDates) },
      revenue:     { current: fill(revenueCurr, currentDates),  previous: fill(revenuePrev, prevDates) },
      commissions: { current: fill(commCurr, currentDates),     previous: fill(commPrev, prevDates) },
      delayed:     { current: fill(delayedCurr, currentDates),  previous: fill(delayedPrev, prevDates) },
    };
  }

  /* ─── helpers ─── */

  private async dailyCount(
    repo: Repository<any>, alias: string, dateCol: string,
    condition: string, start: string, end: string,
  ) {
    return repo.createQueryBuilder(alias)
      .select(`TO_CHAR(${dateCol}, 'YYYY-MM-DD')`, 'day')
      .addSelect('COUNT(*)', 'val')
      .where(condition)
      .andWhere(`${dateCol} >= :start::date`, { start })
      .andWhere(`${dateCol} < (:end::date + interval '1 day')`, { end })
      .groupBy(`TO_CHAR(${dateCol}, 'YYYY-MM-DD')`)
      .getRawMany();
  }

  private async dailySum(
    repo: Repository<any>, alias: string, dateCol: string, sumCol: string,
    condition: string, start: string, end: string,
  ) {
    return repo.createQueryBuilder(alias)
      .select(`TO_CHAR(${dateCol}, 'YYYY-MM-DD')`, 'day')
      .addSelect(`COALESCE(SUM(${sumCol}), 0)`, 'val')
      .where(condition)
      .andWhere(`${dateCol} >= :start::date`, { start })
      .andWhere(`${dateCol} < (:end::date + interval '1 day')`, { end })
      .groupBy(`TO_CHAR(${dateCol}, 'YYYY-MM-DD')`)
      .getRawMany();
  }

  private calcTrend(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }
}
