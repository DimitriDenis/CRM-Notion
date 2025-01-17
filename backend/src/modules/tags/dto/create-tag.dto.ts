// src/modules/tags/dto/create-tag.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsHexColor } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsHexColor()
  @IsOptional()
  color?: string;
}