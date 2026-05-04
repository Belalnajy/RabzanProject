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

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'display_id', unique: true, length: 50 })
  displayId: string; // e.g. TRX-001234

  @Column({
    name: 'payment_type',
    type: 'enum',
    enum: ['first_payment', 'final_payment', 'commission', 'partial_payment'],
  })
  paymentType: 'first_payment' | 'final_payment' | 'commission' | 'partial_payment';

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ length: 10, default: 'EGP' })
  currency: string;

  @Column({ name: 'payment_date', type: 'date' })
  paymentDate: Date;

  @Column({ name: 'proof_file', length: 500, nullable: true })
  proofFile: string; // File path for payment proof

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'overdue', 'voided'],
    default: 'pending',
  })
  status: 'pending' | 'confirmed' | 'overdue' | 'voided';

  @Column({ name: 'void_reason', type: 'text', nullable: true })
  voidReason: string;

  // Relations
  @ManyToOne(() => Order, (order) => order.transactions)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'added_by' })
  addedBy: User;

  @Column({ name: 'added_by', type: 'uuid', nullable: true })
  addedById: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
