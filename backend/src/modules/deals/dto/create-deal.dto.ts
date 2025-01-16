// src/modules/deals/dto/create-deal.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsUUID, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDealDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Type(() => Number)
  value: number;

  @IsUUID()
  @IsNotEmpty()
  pipelineId: string;

  @IsString()
  @IsNotEmpty()
  stageId: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expectedCloseDate?: Date;

  @IsUUID(4, { each: true })
  @IsOptional()
  contactIds?: string[];

  @IsOptional()
  customFields?: Record<string, any>;
}