// src/modules/notion/notion.module.ts
import { Module } from '@nestjs/common';
import { NotionService } from './notion.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from '../contacts/contact.entity';
import { ContactsModule } from '../contacts/contacts.module';
import { ContactSyncService } from './contact-sync.service';
import { Pipeline } from '../pipelines/pipeline.entity';
import { PipelinesModule } from '../pipelines/pipelines.module';
import { PipelineSyncService } from './pipeline-sync.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Contact, Pipeline]),
  ContactsModule, PipelinesModule, 
],
  providers: [NotionService, ContactSyncService, PipelineSyncService],
  exports: [NotionService, ContactSyncService, PipelineSyncService],
})
export class NotionModule {}