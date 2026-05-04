import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class QueryOrderDto {
  @IsOptional()
  @IsString({ message: 'معرّف العميل يجب أن يكون نصًا' })
  client?: string;

  @IsOptional()
  @IsString({ message: 'معرّف المنتج يجب أن يكون نصًا' })
  product?: string;

  @IsOptional()
  @IsString({ message: 'المرحلة يجب أن تكون نصًا' })
  stage?: string;

  @IsOptional()
  @IsString({ message: 'التاريخ يجب أن يكون نصًا' })
  date?: string;

  @IsOptional()
  @IsString({ message: 'الأولوية يجب أن تكون نصًا' })
  priority?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'رقم الصفحة يجب أن يكون رقمًا' })
  page?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'عدد العناصر يجب أن يكون رقمًا' })
  limit?: string;
}
