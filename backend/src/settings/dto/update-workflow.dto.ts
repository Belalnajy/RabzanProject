import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WorkflowStageItemDto {
  @IsUUID('4', { message: 'معرف المرحلة غير صالح' })
  id: string;

  @IsString({ message: 'عنوان المرحلة يجب أن يكون نصاً' })
  title: string;

  @IsOptional()
  @IsBoolean({ message: 'حقل إلزامي يجب أن يكون منطقياً' })
  isMandatory?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'حقل يحتاج تأكيد يجب أن يكون منطقياً' })
  needsConfirmation?: boolean;
}

export class UpdateWorkflowDto {
  @IsArray({ message: 'المراحل يجب أن تكون مصفوفة' })
  @ValidateNested({ each: true })
  @Type(() => WorkflowStageItemDto)
  stages: WorkflowStageItemDto[];
}

export class CreateWorkflowStageDto {
  @IsString({ message: 'عنوان المرحلة مطلوب' })
  title: string;

  @IsOptional()
  @IsBoolean({ message: 'حقل إلزامي يجب أن يكون منطقياً' })
  isMandatory?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'حقل يحتاج تأكيد يجب أن يكون منطقياً' })
  needsConfirmation?: boolean;
}
