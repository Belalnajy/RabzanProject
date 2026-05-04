import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'التوكن مطلوب' })
  @IsNotEmpty({ message: 'التوكن مطلوب' })
  token: string;

  @IsString({ message: 'كلمة المرور الجديدة مطلوبة' })
  @MinLength(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
  @IsNotEmpty({ message: 'كلمة المرور الجديدة مطلوبة' })
  newPassword: string;

  @IsString({ message: 'تأكيد كلمة المرور مطلوب' })
  @MinLength(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
  @IsNotEmpty({ message: 'تأكيد كلمة المرور مطلوب' })
  confirmNewPassword: string;
}
