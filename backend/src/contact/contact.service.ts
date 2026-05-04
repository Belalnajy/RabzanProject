import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from '../entities/contact-message.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactRepo: Repository<ContactMessage>,
  ) {}

  async create(dto: CreateContactDto) {
    const message = this.contactRepo.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      type: dto.type || 'quote',
      service: dto.service,
      message: dto.message,
    });

    await this.contactRepo.save(message);

    return {
      message: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.',
    };
  }

  async findAll(query: { page?: string; limit?: string; status?: string }) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const qb = this.contactRepo.createQueryBuilder('msg');

    if (query.status) {
      qb.andWhere('msg.status = :status', { status: query.status });
    }

    qb.orderBy('msg.createdAt', 'DESC');

    const [data, totalItems] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    };
  }

  async markAsRead(id: string) {
    await this.contactRepo.update(id, { status: 'read' });
    return { message: 'تم تحديث الحالة' };
  }
}
