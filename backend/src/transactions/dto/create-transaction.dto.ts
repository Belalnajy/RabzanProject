import {
  IsUUID,
  IsEnum,
  IsNumber,
  IsDateString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateTransactionDto {
  @IsUUID('4', { message: 'معرّف الطلب يجب أن يكون UUID صالح' })
  orderId: string;

  @IsEnum(['first_payment', 'final_payment', 'commission', 'partial_payment'], {
    message: 'نوع الدفع يجب أن يكون أحد: first_payment, final_payment, commission, partial_payment',
  })
  paymentType: 'first_payment' | 'final_payment' | 'commission' | 'partial_payment';

  @IsNumber({}, { message: 'المبلغ يجب أن يكون رقمًا' })
  @Min(0.01, { message: 'المبلغ يجب أن يكون 0.01 على الأقل' })
  amount: number;

  @IsOptional()
  @IsString({ message: 'العملة يجب أن تكون نصًا' })
  currency?: string;

  @IsDateString({}, { message: 'تاريخ الدفع يجب أن يكون تاريخًا صالحًا' })
  paymentDate: string;

  @IsOptional()
  @IsString({ message: 'الملاحظات يجب أن تكون نصًا' })
  notes?: string;
}
