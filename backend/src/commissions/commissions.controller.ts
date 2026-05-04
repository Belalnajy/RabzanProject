import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommissionsService } from './commissions.service';

@Controller('commissions')
@UseGuards(JwtAuthGuard)
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.commissionsService.findAll({ page, limit });
  }

  @Get('stats')
  getStats() {
    return this.commissionsService.getStats();
  }

  @Get(':orderId')
  findByOrder(@Param('orderId', ParseUUIDPipe) orderId: string) {
    return this.commissionsService.findByOrder(orderId);
  }
}
