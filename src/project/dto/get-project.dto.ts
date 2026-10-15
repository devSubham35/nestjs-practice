import { Transform } from 'class-transformer';
import { PROJECT_STATUS } from '../project.types';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetProjectsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Return only projects with this status',
    enum: PROJECT_STATUS,
    enumName: 'ProjectStatus',
    example: PROJECT_STATUS.ACTIVE,
  })
  @IsOptional()
  @IsEnum(PROJECT_STATUS)
  status?: PROJECT_STATUS;

  @ApiPropertyOptional({
    description: 'Set to true to return projects from the trash',
    example: false,
    default: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  @Transform((params) => {
    const value = params.value as unknown;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  trash?: boolean;
}
