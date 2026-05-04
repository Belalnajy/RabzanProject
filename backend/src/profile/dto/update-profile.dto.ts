import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'الاسم الكامل يجب أن يكون نصاً' })
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'رقم الهاتف يجب أن يكون نصاً' })
  phone?: string;
}
