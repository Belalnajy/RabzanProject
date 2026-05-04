import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class QueryProductDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  client?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'رقم الصفحة يجب أن يكون رقماً' })
  page?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'عدد العناصر يجب أن يكون رقماً' })
  limit?: string;
}
