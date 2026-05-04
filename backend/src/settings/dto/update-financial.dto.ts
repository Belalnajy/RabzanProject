import { IsOptional, IsNumber, IsBoolean, IsString } from 'class-validator';

export class UpdateFinancialDto {
  @IsOptional()
  @IsNumber({}, { message: 'نسبة العمولة الافتراضية يجب أن تكون رقماً' })
  defaultCommission?: number;

  @IsOptional()
  @IsBoolean({ message: 'السماح بالتعديل يجب أن يكون منطقياً' })
  allowOverride?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'حد الائتمان يجب أن يكون رقماً' })
  creditLimit?: number;

  @IsOptional()
  @IsString({ message: 'شروط الدفع يجب أن تكون نصاً' })
  paymentTerms?: string;

  @IsOptional()
  @IsNumber({}, { message: 'حد تنبيه التأخير يجب أن يكون رقماً' })
  delayAlertLimit?: number;
}
