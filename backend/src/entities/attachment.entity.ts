import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'file_name', length: 255 })
  fileName: string;

  @Column({ name: 'original_name', length: 255 })
  originalName: string;

  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @Column({ name: 'file_type', length: 50 })
  fileType: string; // e.g. 'pdf', 'jpg', 'png', 'xlsx'

  @Column({ name: 'file_size', type: 'integer', default: 0 })
  fileSize: number; // in bytes

  // Relations
  @ManyToOne(() => Order, (order) => order.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
