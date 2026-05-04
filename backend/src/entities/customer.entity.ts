import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'display_id', unique: true, length: 50 })
  displayId: string; // e.g. CLI-00123

  @Column({ length: 255 })
  name: string;

  @Column({ length: 30, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ name: 'company_name', length: 255, nullable: true })
  companyName: string;

  @Column({ name: 'default_currency', length: 10, default: 'EGP' })
  defaultCurrency: string;

  @Column({ name: 'credit_limit', type: 'decimal', precision: 15, scale: 2, default: 0 })
  creditLimit: number;

  @Column({ name: 'allow_credit', type: 'boolean', default: false })
  allowCredit: boolean;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive';

  // Relations
  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToMany(() => Product, (product) => product.customer)
  products: Product[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
