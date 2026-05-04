import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'الاسم الكامل مطلوب' })
  @IsString({ message: 'الاسم الكامل يجب أن يكون نصاً' })
  fullName: string;

  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  email: string;

  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @MinLength(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
  password: string;

  @IsOptional()
  @IsString({ message: 'رقم الهاتف يجب أن يكون نصاً' })
  phone?: string;

  @IsNotEmpty({ message: 'الدور مطلوب' })
  @IsUUID('4', { message: 'معرّف الدور غير صالح' })
  roleId: string;
}
