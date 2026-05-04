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
import { Role } from './role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name', length: 255 })
  fullName: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ unique: true, length: 100, nullable: true })
  username: string;

  @Column({ select: false }) // Never return password in queries by default
  password: string;

  @Column({ length: 30, nullable: true })
  phone: string;

  @Column({ length: 500, nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive';

  @Column({ name: 'last_login', type: 'timestamptz', nullable: true })
  lastLogin: Date;

  @Column({ name: 'reset_token', length: 500, nullable: true, select: false })
  resetToken: string;

  @Column({ name: 'reset_token_expires', type: 'timestamptz', nullable: true, select: false })
  resetTokenExpires: Date;

  // Relations
  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'role_id', type: 'uuid', nullable: true })
  roleId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
