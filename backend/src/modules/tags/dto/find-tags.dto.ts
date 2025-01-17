// src/modules/tags/dto/find-tags.dto.ts
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindTagsDto {
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
  @IsString()
  search?: string;
}