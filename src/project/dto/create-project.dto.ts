import { PROJECT_STATUS } from '../project.types';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Project name',
    example: 'TaskFlow mobile app',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({
    description: 'Short description of the project',
    example: 'Build and release the first version of the mobile app.',
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;

  @ApiPropertyOptional({
    description: 'Current project status',
    enum: PROJECT_STATUS,
    enumName: 'ProjectStatus',
    example: PROJECT_STATUS.ACTIVE,
    default: PROJECT_STATUS.ACTIVE,
  })
  @IsOptional()
  @IsEnum(PROJECT_STATUS)
  status?: PROJECT_STATUS;
}
