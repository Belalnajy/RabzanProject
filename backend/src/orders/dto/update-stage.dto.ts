import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateStageDto {
  @IsString({ message: 'المرحلة الجديدة يجب أن تكون نصًا' })
  @IsNotEmpty({ message: 'المرحلة الجديدة مطلوبة' })
  newStage: string;

  @IsString({ message: 'السبب يجب أن يكون نصًا' })
  @IsNotEmpty({ message: 'سبب تغيير المرحلة مطلوب' })
  reason: string;
}
