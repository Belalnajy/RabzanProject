import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('overview')
  getOverview(
    @Query('period') period?: string,
    @Query('client') client?: string,
    @Query('product') product?: string,
    @Query('status') status?: string,
  ) {
    return this.reportsService.getOverview({ period, client, product, status });
  }

  @Get('sales')
  getSalesReport(
    @Query('period') period?: string,
    @Query('client') client?: string,
    @Query('product') product?: string,
    @Query('status') status?: string,
  ) {
    return this.reportsService.getSalesReport({ period, client, product, status });
  }

  @Get('financial')
  getFinancialReport(
    @Query('period') period?: string,
    @Query('client') client?: string,
    @Query('product') product?: string,
    @Query('status') status?: string,
  ) {
    return this.reportsService.getFinancialReport({ period, client, product, status });
  }

  @Get('commissions')
  getCommissionsReport(
    @Query('period') period?: string,
    @Query('client') client?: string,
    @Query('product') product?: string,
    @Query('status') status?: string,
  ) {
    return this.reportsService.getCommissionsReport({ period, client, product, status });
  }

  @Get('export/pdf')
  exportPdf() {
    return this.reportsService.exportPdf();
  }

  @Get('export/excel')
  exportExcel() {
    return this.reportsService.exportExcel();
  }
}
