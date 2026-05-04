import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Category } from './category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'display_id', unique: true, length: 50 })
  displayId: string; // e.g. PROD-00123

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'name_ar', length: 255, nullable: true })
  nameAr: string;

  @Column({ length: 50, nullable: true })
  model: string;

  @Column({ name: 'default_price', type: 'decimal', precision: 10, scale: 2 })
  defaultPrice: number;

  @Column({ type: 'varchar', length: 10, default: 'EGP' })
  currency: string;

  @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  commissionRate: number; // percentage, e.g. 8.00

  @Column({
    type: 'enum',
    enum: ['active', 'archived'],
    default: 'active',
  })
  status: 'active' | 'archived';

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'long_description', type: 'text', nullable: true })
  longDescription: string;

  @Column({ length: 500, nullable: true })
  image: string;

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  gallery: string[]; // Array of image URLs

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  features: string[]; // Array of feature strings

  @Column({ type: 'jsonb', nullable: true, default: '{}' })
  specs: Record<string, string>; // Key-value spec pairs

  // Relations
  @ManyToOne(() => Customer, (customer) => customer.products, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'customer_id', type: 'uuid', nullable: true })
  customerId: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
