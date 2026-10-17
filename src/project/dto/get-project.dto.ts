import { Transform } from 'class-transformer';
import { PROJECT_STATUS } from '../project.types';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

export class GetProjectsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(PROJECT_STATUS)
  status?: PROJECT_STATUS;

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
