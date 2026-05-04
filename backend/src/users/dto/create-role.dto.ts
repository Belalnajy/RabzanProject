import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'اسم الدور مطلوب' })
  @IsString({ message: 'اسم الدور يجب أن يكون نصاً' })
  name: string;

  @IsOptional()
  @IsString({ message: 'الاسم بالإنجليزية يجب أن يكون نصاً' })
  nameEn?: string;

  @IsOptional()
  @IsString({ message: 'الوصف يجب أن يكون نصاً' })
  description?: string;

  @IsArray({ message: 'الصلاحيات يجب أن تكون قائمة' })
  @IsUUID('4', { each: true, message: 'معرّف الصلاحية غير صالح' })
  permissionIds: string[];
}
