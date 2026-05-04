import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, Transaction, Customer, Product } from '../entities';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Transaction, Customer, Product])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
