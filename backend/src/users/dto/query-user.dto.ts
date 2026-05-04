import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class QueryUserDto {
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'رقم الصفحة يجب أن يكون رقماً' })
  page?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'عدد العناصر يجب أن يكون رقماً' })
  limit?: string;
}
