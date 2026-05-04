import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Transaction } from '../entities/transaction.entity';
import { CommissionsController } from './commissions.controller';
import { CommissionsService } from './commissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Transaction])],
  controllers: [CommissionsController],
  providers: [CommissionsService],
})
export class CommissionsModule {}
