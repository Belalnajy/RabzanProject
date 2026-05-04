import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('contact_messages')
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'quote' })
  type: string; // 'quote' | 'support'

  @Column({ nullable: true })
  service: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: 'new' })
  status: string; // 'new' | 'read' | 'replied'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
