// src/modules/notion/notion.module.ts
import { Module } from '@nestjs/common';
import { NotionService } from './notion.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [NotionService],
  exports: [NotionService],
})
export class NotionModule {}