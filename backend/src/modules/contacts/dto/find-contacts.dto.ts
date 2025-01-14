// src/modules/contacts/dto/find-contacts.dto.ts
import { IsOptional, IsString, IsUUID, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindContactsDto {
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

  @IsOptional()
  @IsUUID(4, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  tagIds?: string[];
}

