import {
  IsIn,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class AddPaymentDto {
  @IsIn(['first_payment', 'final_payment', 'commission', 'partial_payment'], {
    message: 'نوع الدفع يجب أن يكون أحد القيم: first_payment, final_payment, commission, partial_payment',
  })
  paymentType: 'first_payment' | 'final_payment' | 'commission' | 'partial_payment';

  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'المبلغ يجب أن يكون رقمًا' })
  @Min(0.01, { message: 'المبلغ يجب أن يكون أكبر من صفر' })
  amount: number;

  @IsOptional()
  @IsString({ message: 'العملة يجب أن تكون نصًا' })
  currency?: string;

  @IsDateString({}, { message: 'تاريخ الدفع يجب أن يكون بصيغة تاريخ صالحة' })
  paymentDate: string;

  @IsOptional()
  @IsString({ message: 'الملاحظات يجب أن تكون نصًا' })
  notes?: string;
}
