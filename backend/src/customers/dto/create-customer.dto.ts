import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty({ message: 'اسم العميل مطلوب' })
  @IsString({ message: 'اسم العميل يجب أن يكون نصاً' })
  name: string;

  @IsOptional()
  @IsString({ message: 'رقم الهاتف يجب أن يكون نصاً' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'الدولة يجب أن تكون نصاً' })
  country?: string;

  @IsOptional()
  @IsString({ message: 'العنوان يجب أن يكون نصاً' })
  address?: string;

  @IsOptional()
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'اسم الشركة يجب أن يكون نصاً' })
  companyName?: string;

  @IsOptional()
  @IsString({ message: 'العملة يجب أن تكون نصاً' })
  defaultCurrency?: string;

  @IsOptional()
  @IsNumber({}, { message: 'حد الائتمان يجب أن يكون رقماً' })
  creditLimit?: number;

  @IsOptional()
  @IsBoolean({ message: 'السماح بالائتمان يجب أن يكون قيمة منطقية' })
  allowCredit?: boolean;
}
