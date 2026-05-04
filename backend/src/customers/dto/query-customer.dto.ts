import { IsOptional, IsString, IsNumberString, IsIn } from 'class-validator';

export class QueryCustomerDto {
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsIn(['has_debt', 'no_debt', 'all'], { message: 'قيمة الديون يجب أن تكون has_debt أو no_debt أو all' })
  debt?: 'has_debt' | 'no_debt' | 'all';

  @IsOptional()
  @IsNumberString({}, { message: 'رقم الصفحة يجب أن يكون رقماً' })
  page?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'عدد العناصر يجب أن يكون رقماً' })
  limit?: string;
}
