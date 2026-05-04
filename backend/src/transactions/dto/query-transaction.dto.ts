import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class QueryTransactionDto {
  @IsOptional()
  @IsString({ message: 'نوع الدفع يجب أن يكون نصًا' })
  paymentType?: string;

  @IsOptional()
  @IsString({ message: 'الحالة يجب أن تكون نصًا' })
  status?: string;

  @IsOptional()
  @IsString({ message: 'معرّف العميل يجب أن يكون نصًا' })
  client?: string;

  @IsOptional()
  @IsString({ message: 'نطاق التاريخ يجب أن يكون نصًا' })
  dateRange?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'رقم الصفحة يجب أن يكون رقمًا' })
  page?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'عدد العناصر يجب أن يكون رقمًا' })
  limit?: string;
}
