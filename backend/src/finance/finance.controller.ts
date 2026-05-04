import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FinanceService } from './finance.service';

@Controller('finance')
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('overview')
  getOverview(
    @Query('status') status?: string,
    @Query('product') product?: string,
    @Query('client') client?: string,
    @Query('date') date?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.financeService.getOverview({
      status,
      product,
      client,
      date,
      page,
      limit,
    });
  }

  @Get('stats')
  getStats() {
    return this.financeService.getStats();
  }

  @Get('charts/revenue')
  getRevenueChart() {
    return this.financeService.getRevenueChart();
  }

  @Get('charts/paid-vs-due')
  getPaidVsDueChart() {
    return this.financeService.getPaidVsDueChart();
  }

  @Get('charts/status-distribution')
  getStatusDistribution() {
    return this.financeService.getStatusDistribution();
  }

  @Get('recent-transactions')
  getRecentTransactions() {
    return this.financeService.getRecentTransactions();
  }

  @Get('commission-tracking')
  getCommissionTracking(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.financeService.getCommissionTracking({ page, limit });
  }
}
