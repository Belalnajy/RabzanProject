import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async notifyAdmins(data: { message: string; type?: string; referenceId?: string; referenceType?: string }) {
    const admins = await this.userRepository.find({
      relations: ['role'],
    });
    
    // Send to all active users that have admin or manager role
    const targetUsers = admins.filter(u => 
      u.status === 'active' && u.role &&
      (u.role.name?.toLowerCase().includes('admin') || 
       u.role.name?.includes('مسؤول') ||
       u.role.name?.includes('مدير') ||
       u.role.name?.toLowerCase().includes('manager'))
    );

    if (targetUsers.length === 0) return;

    const notifications = targetUsers.map(user => 
      this.notificationRepository.create({
        userId: user.id,
        ...data,
      })
    );

    await this.notificationRepository.save(notifications);
  }

  async createForUser(userId: string, data: { message: string; type?: string; referenceId?: string; referenceType?: string }) {
    const notification = this.notificationRepository.create({
      userId,
      ...data,
    });
    return this.notificationRepository.save(notification);
  }

  async findAll(userId: string, page = 1, limit = 20) {
    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    const [data, total] = await this.notificationRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      take,
      skip,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationRepository.findOneBy({ id, userId });
    if (!notification) {
      throw new NotFoundException('الإشعار غير موجود');
    }
    await this.notificationRepository.update(id, { isRead: true });
    return { message: 'تم تحديث حالة الإشعار بنجاح' };
  }

  async markAllAsRead(userId: string) {
    const result = await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
    return {
      message: 'تم تحديث جميع الإشعارات بنجاح',
      affected: result.affected ?? 0,
    };
  }

  async getUnreadCount(userId: string) {
    const count = await this.notificationRepository.count({
      where: { userId, isRead: false },
    });
    return { count };
  }
}
