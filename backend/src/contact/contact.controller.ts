import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Public endpoint — no auth required
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }

  // Admin-only — list all messages
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.contactService.findAll({ page, limit, status });
  }

  // Admin-only — mark as read
  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }
}
