import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'يجب أن يكون البريد الإلكتروني صالحاً' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  password: string;
}
