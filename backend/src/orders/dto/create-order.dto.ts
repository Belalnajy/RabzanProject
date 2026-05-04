import {
  IsUUID,
  IsInt,
  IsNumber,
  IsString,
  IsOptional,
  IsIn,
  Min,
  Max,
} from 'class-validator';

export class CreateOrderDto {
  @IsUUID('4', { message: 'معرّف العميل يجب أن يكون UUID صالح' })
  customerId: string;

  @IsOptional()
  @IsUUID('4', { message: 'معرّف المنتج يجب أن يكون UUID صالح' })
  productId?: string;

  @IsInt({ message: 'الكمية يجب أن تكون عدد صحيح' })
  @Min(1, { message: 'الكمية يجب أن تكون 1 على الأقل' })
  quantity: number;

  @IsNumber({}, { message: 'سعر الوحدة يجب أن يكون رقمًا' })
  @Min(0, { message: 'سعر الوحدة لا يمكن أن يكون سالبًا' })
  unitPrice: number;

  @IsOptional()
  @IsString({ message: 'العملة يجب أن تكون نصًا' })
  currency?: string;

  @IsNumber({}, { message: 'نسبة العمولة يجب أن تكون رقمًا' })
  @Min(0, { message: 'نسبة العمولة لا يمكن أن تكون سالبة' })
  @Max(100, { message: 'نسبة العمولة لا يمكن أن تتجاوز 100' })
  commissionRate: number;

  @IsOptional()
  @IsNumber({}, { message: 'الدفعة الأولى يجب أن تكون رقمًا' })
  @Min(0, { message: 'الدفعة الأولى لا يمكن أن تكون سالبة' })
  firstPayment?: number;

  @IsOptional()
  @IsIn(['urgent', 'high', 'medium', 'low'], { message: 'الأولوية يجب أن تكون: urgent, high, medium, low' })
  priority?: string;

  @IsOptional()
  @IsString({ message: 'الملاحظات يجب أن تكون نصًا' })
  notes?: string;
}
