import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Order,
  Transaction,
  Attachment,
  OrderStageHistory,
  WorkflowStage,
  Customer,
  Product,
} from '../entities';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Transaction,
      Attachment,
      OrderStageHistory,
      WorkflowStage,
      Customer,
      Product,
    ]),
    NotificationsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
