import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'يجب أن يكون البريد الإلكتروني صالحاً' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;
}
