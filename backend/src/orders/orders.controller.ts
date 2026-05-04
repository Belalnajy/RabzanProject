import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { AddPaymentDto } from './dto/add-payment.dto';
import { QueryOrderDto } from './dto/query-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Query() query: QueryOrderDto) {
    return this.ordersService.findAll(query);
  }

  @Post()
  create(
    @Body() dto: CreateOrderDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.ordersService.create(dto, userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, dto);
  }

  @Patch(':id/stage')
  updateStage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStageDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.ordersService.updateStage(id, dto, userId);
  }

  @Post(':id/payments')
  addPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddPaymentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.ordersService.addPayment(id, dto, userId);
  }

  @Post(':id/payments/:txId/proof')
  @UseInterceptors(
    FileInterceptor('proofFile', {
      storage: diskStorage({
        destination: './uploads/proofs',
        filename: (_req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  uploadProof(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('txId', ParseUUIDPipe) txId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.ordersService.uploadProof(id, txId, file);
  }

  @Post(':id/attachments')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/attachments',
        filename: (_req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    }),
  )
  addAttachment(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.ordersService.addAttachment(id, file);
  }

  @Delete(':id/attachments/:attachId')
  removeAttachment(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('attachId', ParseUUIDPipe) attachId: string,
  ) {
    return this.ordersService.removeAttachment(id, attachId);
  }
}
