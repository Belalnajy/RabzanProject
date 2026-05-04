import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  key: string; // e.g. 'orders', 'finance', 'products', 'customers', 'reports', 'users'

  @Column({ length: 255 })
  name: string; // Arabic display name, e.g. 'اداره الطلبات'

  @Column({ name: 'name_en', length: 255, nullable: true })
  nameEn: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
