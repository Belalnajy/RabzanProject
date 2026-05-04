import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'اسم التصنيف بالعربية مطلوب' })
  @IsString({ message: 'اسم التصنيف بالعربية يجب أن يكون نصاً' })
  nameAr: string;

  @IsOptional()
  @IsString({ message: 'اسم التصنيف بالإنجليزية يجب أن يكون نصاً' })
  nameEn?: string;

  @IsOptional()
  @IsString({ message: 'رابط الصورة يجب أن يكون نصاً' })
  image?: string;

  @IsOptional()
  @IsUUID('4', { message: 'معرّف التصنيف الأب غير صالح' })
  parentId?: string;
}
