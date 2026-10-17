import { TASK_PRIORITY, TASK_STATUS } from '../task.types';
import { IsArray, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterTasksQueryDto {
  
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsDateString()
  dueStartDate?: string;

  @IsOptional()
  @IsDateString()
  dueEndDate?: string;

  @IsOptional()
  @IsEnum(TASK_STATUS)
  status?: TASK_STATUS
  
  @IsOptional()
  @IsEnum(TASK_PRIORITY)
  priority?: TASK_PRIORITY
}
