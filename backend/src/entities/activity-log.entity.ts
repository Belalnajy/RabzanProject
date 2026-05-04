import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  action: string; // 'create', 'update', 'delete', 'void', 'stage_change'

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ name: 'entity_type', length: 50 })
  entityType: string; // 'order', 'transaction', 'customer', etc.

  @Column({ name: 'entity_id', type: 'uuid', nullable: true })
  entityId: string;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
