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
import { Deal } from '../deals/deal.entity';
import { DealsModule } from '../deals/deals.module';
import { DealSyncService } from './deal-sync.service';
import { NotionSetupController } from './notion-setup.controller';
import { NotionExportController } from './notion-export.controller';
import { NotionExportService } from './notion-export.service';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Contact, Pipeline, Deal]),
  ContactsModule, PipelinesModule, DealsModule, TagsModule, UsersModule,
],
controllers: [NotionSetupController, NotionExportController],
  providers: [NotionService, ContactSyncService, PipelineSyncService, DealSyncService, NotionExportService],
  exports: [NotionService, ContactSyncService, PipelineSyncService, DealSyncService, NotionExportService],
})
export class NotionModule {}