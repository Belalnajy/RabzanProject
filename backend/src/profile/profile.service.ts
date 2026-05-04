import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findOneBy({ email: dto.email });
      if (existing) {
        throw new BadRequestException('البريد الإلكتروني مستخدم بالفعل');
      }
    }

    await this.userRepository.update(userId, {
      ...(dto.fullName && { fullName: dto.fullName }),
      ...(dto.email && { email: dto.email }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
    });

    return { message: 'تم تحديث الملف الشخصي بنجاح' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('كلمة المرور الجديدة وتأكيدها غير متطابقين');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password'],
    });
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) {
      throw new BadRequestException('كلمة المرور الحالية غير صحيحة');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
    await this.userRepository.update(userId, { password: hashedPassword });

    return { message: 'تم تغيير كلمة المرور بنجاح' };
  }

  async updateAvatar(userId: string, filePath: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    await this.userRepository.update(userId, { avatar: filePath });
    return { message: 'تم تحديث الصورة الشخصية بنجاح', avatar: filePath };
  }
}
