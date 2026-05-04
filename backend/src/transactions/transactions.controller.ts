import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { VoidTransactionDto } from './dto/void-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(@Query() query: QueryTransactionDto) {
    return this.transactionsService.findAll(query);
  }

  @Post()
  create(
    @Body() dto: CreateTransactionDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.transactionsService.create(dto, userId);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTransactionDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.transactionsService.update(id, dto, userId);
  }

  @Patch(':id/void')
  void(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: VoidTransactionDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.transactionsService.void(id, dto.reason, userId);
  }

  @Get('activity-log')
  getActivityLog(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.transactionsService.getActivityLog({ page, limit });
  }

  @Get(':id/receipt')
  getReceipt(@Param('id', ParseUUIDPipe) id: string) {
    return this.transactionsService.getReceipt(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.transactionsService.findOne(id);
  }
}
