import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { PROJECT_STATUS } from '../project.types';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsEnum(PROJECT_STATUS)
  status?: PROJECT_STATUS;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  members?: string[];
}
