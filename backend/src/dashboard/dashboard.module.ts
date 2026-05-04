import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, Transaction } from '../entities';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Transaction])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
