import { IsOptional, IsString } from 'class-validator';

export class UpdateGeneralDto {
  @IsOptional()
  @IsString({ message: 'اسم النظام يجب أن يكون نصاً' })
  systemName?: string;

  @IsOptional()
  @IsString({ message: 'اسم الشركة يجب أن يكون نصاً' })
  companyName?: string;

  @IsOptional()
  @IsString({ message: 'اللغة يجب أن تكون نصاً' })
  lang?: string;

  @IsOptional()
  @IsString({ message: 'المنطقة الزمنية يجب أن تكون نصاً' })
  timezone?: string;

  @IsOptional()
  @IsString({ message: 'صيغة التاريخ يجب أن تكون نصاً' })
  dateFormat?: string;
}
