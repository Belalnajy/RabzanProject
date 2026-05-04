import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  key: string; // e.g. 'system_name', 'company_name', 'default_commission'

  @Column({ type: 'text' })
  value: string;

  @Column({ length: 50, default: 'general' })
  group: string; // 'general', 'workflow', 'financial', 'currency', 'preferences'

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'last_modified_by', length: 255, nullable: true })
  lastModifiedBy: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
