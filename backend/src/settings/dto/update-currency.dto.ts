import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateDefaultCurrencyDto {
  @IsString({ message: 'العملة الافتراضية مطلوبة' })
  defaultCurrency: string;
}

export class CreateCurrencyDto {
  @IsString({ message: 'رمز العملة مطلوب' })
  code: string;

  @IsString({ message: 'اسم العملة مطلوب' })
  name: string;

  @IsNumber({}, { message: 'سعر الصرف يجب أن يكون رقماً' })
  exchangeRate: number;
}

export class UpdateExchangeRateDto {
  @IsNumber({}, { message: 'سعر الصرف يجب أن يكون رقماً' })
  exchangeRate: number;
}
