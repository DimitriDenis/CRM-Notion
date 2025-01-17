// src/modules/tags/dto/update-tag.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tag.dto';

export class UpdateTagDto extends PartialType(CreateTagDto) {}