import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TASK_PRIORITY, TASK_STATUS } from '../task.types';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title!: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  assignedTo?: string[];

  @IsNotEmpty()
  @IsEnum(TASK_STATUS)
  status!: TASK_STATUS;

  @IsNotEmpty()
  @IsEnum(TASK_PRIORITY)
  priority!: TASK_PRIORITY;
}
