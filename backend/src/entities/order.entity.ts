import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Product } from './product.entity';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';
import { Attachment } from './attachment.entity';
import { OrderStageHistory } from './order-stage-history.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'display_id', unique: true, length: 50 })
  displayId: string; // e.g. ORD-2023-001

  // Financial fields (server-computed, never trust client)
  @Column({ type: 'integer', default: 0 })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 15, scale: 2, default: 0 })
  unitPrice: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalPrice: number; // Server-computed: quantity × unitPrice

  @Column({ length: 10, default: 'EGP' })
  currency: string;

  @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
  commissionRate: number;

  @Column({ name: 'commission_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  commissionAmount: number; // Server-computed: totalPrice × commissionRate / 100

  @Column({ name: 'total_paid', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalPaid: number;

  @Column({ name: 'remaining_balance', type: 'decimal', precision: 15, scale: 2, default: 0 })
  remainingBalance: number; // Server-computed: totalPrice - totalPaid

  @Column({ name: 'first_payment', type: 'decimal', precision: 15, scale: 2, default: 0 })
  firstPayment: number;

  // Stage tracking
  @Column({
    name: 'current_stage',
    length: 100,
    default: 'استلام الطلب',
  })
  currentStage: string;

  @Column({
    type: 'enum',
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  })
  status: 'active' | 'completed' | 'cancelled';

  @Column({
    type: 'varchar',
    length: 20,
    default: 'medium',
  })
  priority: 'urgent' | 'high' | 'medium' | 'low';

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relations
  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id', type: 'uuid', nullable: true })
  productId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdById: string;

  @OneToMany(() => Transaction, (transaction) => transaction.order)
  transactions: Transaction[];

  @OneToMany(() => Attachment, (attachment) => attachment.order)
  attachments: Attachment[];

  @OneToMany(() => OrderStageHistory, (history) => history.order)
  stageHistory: OrderStageHistory[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
