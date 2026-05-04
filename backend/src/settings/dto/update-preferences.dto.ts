import { IsOptional, IsBoolean } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsBoolean({ message: 'الوضع الداكن يجب أن يكون منطقياً' })
  darkMode?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'تسجيل الخروج التلقائي يجب أن يكون منطقياً' })
  autoLogout?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'سجل المراجعة يجب أن يكون منطقياً' })
  auditLog?: boolean;
}
