// src/modules/deals/dto/find-deals.dto.ts
import { IsOptional, IsUUID, IsString, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindDealsDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  skip?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  take?: number = 10;

  @IsOptional()
  @IsUUID()
  pipelineId?: string;

  @IsOptional()
  @IsString()
  stageId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}