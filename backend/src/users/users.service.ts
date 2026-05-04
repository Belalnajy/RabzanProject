import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, Role } from '../entities';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async findAll(query: QueryUserDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const qb = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');

    if (query.role) {
      qb.andWhere('role.id = :roleId', { roleId: query.role });
    }

    if (query.status) {
      qb.andWhere('user.status = :status', { status: query.status });
    }

    if (query.date) {
      qb.andWhere('DATE(user.createdAt) = :date', { date: query.date });
    }

    qb.orderBy('user.createdAt', 'DESC');

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

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
    }

    const role = await this.roleRepo.findOne({ where: { id: dto.roleId } });
    if (!role) {
      throw new NotFoundException('الدور غير موجود');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = this.userRepo.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashedPassword,
      phone: dto.phone,
      roleId: dto.roleId,
    });

    const saved = await this.userRepo.save(user);

    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepo.findOne({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
      }
    }

    if (dto.roleId) {
      const role = await this.roleRepo.findOne({ where: { id: dto.roleId } });
      if (!role) {
        throw new NotFoundException('الدور غير موجود');
      }
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 12);
    }

    Object.assign(user, dto);
    await this.userRepo.save(user);

    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    user.status = 'inactive';
    await this.userRepo.save(user);
    return { message: 'تم تعطيل المستخدم بنجاح' };
  }

  async resetPassword(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    const plainPassword = this.generateRandomPassword(12);
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    await this.userRepo.update(id, { password: hashedPassword });

    // TODO: Send the new password via email instead of returning it in the response.
    // For now, we return it so the admin can communicate it securely, but this
    // should be replaced with an email notification once SMTP is configured.
    return {
      message: 'تم إعادة تعيين كلمة المرور بنجاح',
      temporaryPassword: plainPassword,
    };
  }

  private generateRandomPassword(length: number): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
