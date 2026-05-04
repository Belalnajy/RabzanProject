import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Transaction } from '../entities/transaction.entity';
import { Customer } from '../entities/customer.entity';
import { Product } from '../entities/product.entity';

interface OverviewFilters {
  period?: string;
  client?: string;
  product?: string;
  status?: string;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getOverview(filters: OverviewFilters) {
    const qb = this.orderRepository.createQueryBuilder('o');
    this.applyFilters(qb, filters);

    const [totalOrders, kpis, statusBreakdownRaw, monthlyTrendRaw] = await Promise.all([
      qb.getCount(),
      this.orderRepository
        .createQueryBuilder('o')
        .select('COALESCE(SUM(o.total_price), 0)', 'totalRevenue')
        .addSelect('COALESCE(SUM(o.commission_amount), 0)', 'totalCommission')
        .addSelect('COALESCE(AVG(o.total_price), 0)', 'avgOrderValue')
        .where(this.buildWhereClause(filters))
        .getRawOne(),
      this.orderRepository
        .createQueryBuilder('o')
        .select('o.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .where(this.buildWhereClause(filters))
        .groupBy('o.status')
        .getRawMany(),
      this.orderRepository
        .createQueryBuilder('o')
        .select("TO_CHAR(o.created_at, 'YYYY-MM')", 'month')
        .addSelect('COUNT(*)', 'orders')
        .addSelect('COALESCE(SUM(o.total_price), 0)', 'revenue')
        .where(this.buildWhereClause(filters))
        .groupBy("TO_CHAR(o.created_at, 'YYYY-MM')")
        .orderBy("TO_CHAR(o.created_at, 'YYYY-MM')", 'ASC')
        .getRawMany(),
    ]);

    return {
      kpis: {
        totalOrders,
        totalRevenue: parseFloat(kpis?.totalRevenue) || 0,
        totalCommission: parseFloat(kpis?.totalCommission) || 0,
        avgOrderValue: parseFloat(kpis?.avgOrderValue) || 0,
      },
      charts: {
        statusBreakdown: statusBreakdownRaw.map((r) => ({
          status: r.status,
          count: parseInt(r.count, 10),
        })),
        monthlyTrend: monthlyTrendRaw.map((r) => ({
          month: r.month,
          orders: parseInt(r.orders, 10),
          revenue: parseFloat(r.revenue) || 0,
        })),
      },
    };
  }

  async getSalesReport(filters: OverviewFilters) {
    const qb = this.orderRepository.createQueryBuilder('o');
    this.applyFilters(qb, filters);

    const [monthlySales, topProducts, recentOrders] = await Promise.all([
      this.orderRepository
        .createQueryBuilder('o')
        .select("TO_CHAR(o.created_at, 'YYYY-MM')", 'month')
        .addSelect('COUNT(*)', 'orders')
        .addSelect('COALESCE(SUM(o.total_price), 0)', 'revenue')
        .where(this.buildWhereClause(filters))
        .groupBy("TO_CHAR(o.created_at, 'YYYY-MM')")
        .orderBy("TO_CHAR(o.created_at, 'YYYY-MM')", 'DESC')
        .limit(12)
        .getRawMany(),
      this.orderRepository
        .createQueryBuilder('o')
        .innerJoin('o.product', 'p')
        .select('p.name', 'productName')
        .addSelect('COUNT(*)', 'orderCount')
        .addSelect('COALESCE(SUM(o.total_price), 0)', 'totalRevenue')
        .where(this.buildWhereClause(filters))
        .groupBy('p.name')
        .orderBy('COUNT(*)', 'DESC')
        .limit(10)
        .getRawMany(),
      qb
        .leftJoin('o.customer', 'customer')
        .leftJoin('o.product', 'product')
        .select([
          'o.id', 'o.displayId', 'o.totalPrice', 'o.status', 'o.currentStage', 'o.createdAt',
          'customer.id', 'customer.name',
          'product.id', 'product.name'
        ])
        .orderBy('o.createdAt', 'DESC')
        .take(20)
        .getMany(),
    ]);

    return {
      charts: {
        monthlySales: monthlySales.map((r) => ({
          month: r.month,
          orders: parseInt(r.orders, 10),
          revenue: parseFloat(r.revenue) || 0,
        })),
        topProducts: topProducts.map((r) => ({
          productName: r.productName,
          orderCount: parseInt(r.orderCount, 10),
          totalRevenue: parseFloat(r.totalRevenue) || 0,
        })),
      },
      orders: recentOrders,
    };
  }

  async getFinancialReport(filters: OverviewFilters) {
    const [monthlyFinancials, clientFinancials] = await Promise.all([
      this.transactionRepository
        .createQueryBuilder('t')
        .innerJoin('t.order', 'o')
        .select("TO_CHAR(t.created_at, 'YYYY-MM')", 'month')
        .addSelect('COALESCE(SUM(t.amount), 0)', 'totalPaid')
        .addSelect('COUNT(*)', 'transactionCount')
        .where('t.status = :status', { status: 'confirmed' })
        .andWhere(this.buildWhereClause(filters))
        .groupBy("TO_CHAR(t.created_at, 'YYYY-MM')")
        .orderBy("TO_CHAR(t.created_at, 'YYYY-MM')", 'DESC')
        .limit(12)
        .getRawMany(),
      this.orderRepository
        .createQueryBuilder('o')
        .innerJoin('o.customer', 'c')
        .select('c.name', 'clientName')
        .addSelect('COUNT(*)', 'orderCount')
        .addSelect('COALESCE(SUM(o.total_price), 0)', 'totalValue')
        .addSelect('COALESCE(SUM(o.total_paid), 0)', 'totalPaid')
        .addSelect('COALESCE(SUM(o.remaining_balance), 0)', 'remainingBalance')
        .where(this.buildWhereClause(filters))
        .groupBy('c.name')
        .orderBy('COALESCE(SUM(o.total_price), 0)', 'DESC')
        .getRawMany(),
    ]);

    return {
      charts: {
        monthlyFinancials: monthlyFinancials.map((r) => ({
          month: r.month,
          totalPaid: parseFloat(r.totalPaid) || 0,
          transactionCount: parseInt(r.transactionCount, 10),
        })),
      },
      clientFinancials: clientFinancials.map((r) => ({
        clientName: r.clientName,
        orderCount: parseInt(r.orderCount, 10),
        totalValue: parseFloat(r.totalValue) || 0,
        totalPaid: parseFloat(r.totalPaid) || 0,
        remainingBalance: parseFloat(r.remainingBalance) || 0,
      })),
    };
  }

  async getCommissionsReport(filters: OverviewFilters) {
    const qb = this.orderRepository.createQueryBuilder('o');
    this.applyFilters(qb, filters);

    const [kpisRaw, monthlyCommissions, commissionTable] = await Promise.all([
      this.orderRepository
        .createQueryBuilder('o')
        .select('COALESCE(SUM(o.commission_amount), 0)', 'totalCommission')
        .addSelect('COALESCE(AVG(o.commission_rate), 0)', 'avgRate')
        .addSelect('COUNT(*)', 'totalOrders')
        .where(this.buildWhereClause(filters))
        .getRawOne(),
      this.orderRepository
        .createQueryBuilder('o')
        .select("TO_CHAR(o.created_at, 'YYYY-MM')", 'month')
        .addSelect('COALESCE(SUM(o.commission_amount), 0)', 'commission')
        .where(this.buildWhereClause(filters))
        .groupBy("TO_CHAR(o.created_at, 'YYYY-MM')")
        .orderBy("TO_CHAR(o.created_at, 'YYYY-MM')", 'DESC')
        .limit(12)
        .getRawMany(),
      qb
        .leftJoin('o.customer', 'customer')
        .leftJoin('o.product', 'product')
        .select([
          'o.id', 'o.displayId', 'o.totalPrice', 'o.commissionRate', 'o.commissionAmount', 'o.createdAt',
          'customer.id', 'customer.name',
          'product.id', 'product.name'
        ])
        .orderBy('o.commissionAmount', 'DESC')
        .take(20)
        .getMany(),
    ]);

    return {
      kpis: {
        totalCommission: parseFloat(kpisRaw?.totalCommission) || 0,
        avgCommissionRate: parseFloat(kpisRaw?.avgRate) || 0,
        totalOrders: parseInt(kpisRaw?.totalOrders, 10) || 0,
      },
      charts: {
        monthlyCommissions: monthlyCommissions.map((r) => ({
          month: r.month,
          commission: parseFloat(r.commission) || 0,
        })),
      },
      commissions: commissionTable,
    };
  }

  exportPdf() {
    return { message: 'PDF export coming soon' };
  }

  exportExcel() {
    return { message: 'Excel export coming soon' };
  }

  private applyFilters(qb: SelectQueryBuilder<Order>, filters: OverviewFilters) {
    if (filters.status) {
      qb.andWhere('o.status = :status', { status: filters.status });
    }
    if (filters.client) {
      qb.andWhere('o.customer_id = :clientId', { clientId: filters.client });
    }
    if (filters.product) {
      qb.andWhere('o.product_id = :productId', { productId: filters.product });
    }
    if (filters.period) {
      const days = this.parsePeriodDays(filters.period);
      if (days > 0) {
        const from = new Date();
        from.setDate(from.getDate() - days);
        qb.andWhere('o.created_at >= :from', { from });
      }
    }
  }

  private buildWhereClause(filters: OverviewFilters): string {
    const conditions: string[] = ['1=1'];
    if (filters.status) conditions.push(`o.status = '${filters.status}'`);
    if (filters.client) conditions.push(`o.customer_id = '${filters.client}'`);
    if (filters.product) conditions.push(`o.product_id = '${filters.product}'`);
    if (filters.period) {
      const days = this.parsePeriodDays(filters.period);
      if (days > 0) {
        conditions.push(`o.created_at >= NOW() - INTERVAL '${days} days'`);
      }
    }
    return conditions.join(' AND ');
  }

  private parsePeriodDays(period: string): number {
    const map: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '6m': 180,
      '1y': 365,
    };
    return map[period] || 0;
  }
}
