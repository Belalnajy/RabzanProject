import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Transaction } from '../entities/transaction.entity';
import { Customer } from '../entities/customer.entity';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Transaction, Customer])],
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class FinanceModule {}
