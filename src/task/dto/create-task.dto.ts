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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { TASK_PRIORITY, TASK_STATUS } from '../task.types';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Create the authentication screens',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title!: string;

  @ApiPropertyOptional({
    description: 'Short description of the task',
    example: 'Implement sign-in and registration screens.',
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;

  @ApiPropertyOptional({
    description: 'Task due date in ISO 8601 format',
    example: '2026-10-31T18:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @ApiPropertyOptional({
    description: 'MongoDB IDs of users assigned to the task',
    type: [String],
    example: ['507f1f77bcf86cd799439011'],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  assignedTo?: string[];

  @ApiProperty({
    description: 'Current task status',
    enum: TASK_STATUS,
    enumName: 'TaskStatus',
    example: TASK_STATUS.PENDING,
  })
  @IsNotEmpty()
  @IsEnum(TASK_STATUS)
  status!: TASK_STATUS;

  @ApiProperty({
    description: 'Task priority',
    enum: TASK_PRIORITY,
    enumName: 'TaskPriority',
    example: TASK_PRIORITY.HIGH,
  })
  @IsNotEmpty()
  @IsEnum(TASK_PRIORITY)
  priority!: TASK_PRIORITY;
}
