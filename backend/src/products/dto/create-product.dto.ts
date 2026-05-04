import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsArray,
  IsObject,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'اسم المنتج مطلوب' })
  @IsString({ message: 'اسم المنتج يجب أن يكون نصاً' })
  name: string;

  @IsOptional()
  @IsString({ message: 'الاسم بالعربية يجب أن يكون نصاً' })
  nameAr?: string;

  @IsOptional()
  @IsString({ message: 'الموديل يجب أن يكون نصاً' })
  model?: string;

  @IsNotEmpty({ message: 'السعر الافتراضي مطلوب' })
  @IsNumber({}, { message: 'السعر الافتراضي يجب أن يكون رقماً' })
  defaultPrice: number;

  @IsOptional()
  @IsString({ message: 'العملة يجب أن تكون نصاً' })
  currency?: string;

  @IsOptional()
  @IsNumber({}, { message: 'نسبة العمولة يجب أن تكون رقماً' })
  commissionRate?: number;

  @IsOptional()
  @IsString({ message: 'الوصف يجب أن يكون نصاً' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'الوصف التفصيلي يجب أن يكون نصاً' })
  longDescription?: string;

  @IsOptional()
  @IsString({ message: 'رابط الصورة يجب أن يكون نصاً' })
  image?: string;

  @IsOptional()
  @IsArray({ message: 'المعرض يجب أن يكون مصفوفة' })
  gallery?: string[];

  @IsOptional()
  @IsArray({ message: 'المميزات يجب أن تكون مصفوفة' })
  features?: string[];

  @IsOptional()
  @IsObject({ message: 'المواصفات يجب أن تكون كائناً' })
  specs?: Record<string, string>;

  @IsOptional()
  @IsUUID('4', { message: 'معرّف التصنيف غير صالح' })
  categoryId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'معرّف العميل غير صالح' })
  customerId?: string;
}
