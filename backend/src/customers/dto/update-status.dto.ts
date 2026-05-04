import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @IsNotEmpty({ message: 'الحالة مطلوبة' })
  @IsIn(['active', 'inactive'], { message: 'الحالة يجب أن تكون active أو inactive' })
  status: 'active' | 'inactive';
}
