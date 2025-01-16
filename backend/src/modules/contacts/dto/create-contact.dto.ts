// src/modules/contacts/dto/create-contact.dto.ts
import { IsEmail, IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty({ message: 'firstName is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'lastName is required' })
  lastName: string;

  @IsEmail({}, { message: 'email must be a valid email address' })
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