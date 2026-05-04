import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'كلمة المرور الحالية مطلوبة' })
  currentPassword: string;

  @IsString({ message: 'كلمة المرور الجديدة مطلوبة' })
  @MinLength(6, { message: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' })
  newPassword: string;

  @IsString({ message: 'تأكيد كلمة المرور مطلوب' })
  confirmPassword: string;
}
