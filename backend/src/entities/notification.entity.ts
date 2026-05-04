import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  @Column({ length: 50, nullable: true })
  type: string; // e.g. 'order_created', 'payment_added', 'stage_updated'

  @Column({ name: 'reference_id', type: 'uuid', nullable: true })
  referenceId: string; // ID of related entity (order, transaction, etc.)

  @Column({ name: 'reference_type', length: 50, nullable: true })
  referenceType: string; // 'order', 'transaction', etc.

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
