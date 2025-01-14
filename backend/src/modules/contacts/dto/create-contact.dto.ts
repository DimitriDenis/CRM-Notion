// src/modules/contacts/dto/create-contact.dto.ts
import { IsEmail, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateContactDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  customFields?: Record<string, any>;

  @IsUUID(4, { each: true })
  @IsOptional()
  tagIds?: string[];
}