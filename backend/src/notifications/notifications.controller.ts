import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('test-trigger')
  async testTrigger() {
    await this.notificationsService.notifyAdmins({
      message: 'This is a test notification',
      type: 'default',
    });
    return { success: true };
  }

  @Get()
  findAll(
    @CurrentUser('sub') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.notificationsService.findAll(userId, page || 1, limit || 20);
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser('sub') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Patch('read-all')
  markAllAsRead(@CurrentUser('sub') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Patch(':id/read')
  markAsRead(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.notificationsService.markAsRead(id, userId);
  }
}
