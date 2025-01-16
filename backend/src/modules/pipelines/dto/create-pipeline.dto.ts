// src/modules/pipelines/dto/create-pipeline.dto.ts
import { IsString, IsArray, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class StageDto {

  @IsString()
  @IsOptional()
  id?: string;
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  order: number;
}

export class CreatePipelineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StageDto)
  stages: StageDto[];
}