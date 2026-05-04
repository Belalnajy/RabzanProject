import { IsString, IsNotEmpty } from 'class-validator';

export class VoidTransactionDto {
  @IsString({ message: 'سبب الإلغاء يجب أن يكون نصًا' })
  @IsNotEmpty({ message: 'سبب الإلغاء مطلوب' })
  reason: string;
}
