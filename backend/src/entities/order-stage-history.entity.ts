import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';

@Entity('order_stage_history')
export class OrderStageHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'from_stage', length: 100, nullable: true })
  fromStage: string;

  @Column({ name: 'to_stage', length: 100 })
  toStage: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  // Relations
  @ManyToOne(() => Order, (order) => order.stageHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'changed_by' })
  changedBy: User;

  @Column({ name: 'changed_by', type: 'uuid', nullable: true })
  changedById: string;

  @CreateDateColumn({ name: 'changed_at', type: 'timestamptz' })
  changedAt: Date;
}
