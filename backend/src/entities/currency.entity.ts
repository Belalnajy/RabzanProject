import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('currencies')
export class Currency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 10 })
  code: string; // e.g. 'SAR', 'USD', 'EGP'

  @Column({ length: 100 })
  name: string; // e.g. 'ريال سعودي'

  @Column({ name: 'exchange_rate', type: 'decimal', precision: 10, scale: 4, default: 1 })
  exchangeRate: number;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
