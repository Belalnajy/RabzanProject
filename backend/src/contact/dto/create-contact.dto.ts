import { IsString, IsEmail, IsOptional, IsNotEmpty, IsIn } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  name: string;

  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsIn(['quote', 'support'], { message: 'نوع الرسالة غير صالح' })
  type?: string;

  @IsOptional()
  @IsString()
  service?: string;

  @IsString()
  @IsNotEmpty({ message: 'الرسالة مطلوبة' })
  message: string;
}
