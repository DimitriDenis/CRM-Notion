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
import { UsersModule } from '../users/users.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Contact, Pipeline, Deal]),
  ContactsModule, PipelinesModule, DealsModule, UsersModule, TagsModule
],
controllers: [NotionSetupController],
  providers: [NotionService, ContactSyncService, PipelineSyncService, DealSyncService],
  exports: [NotionService, ContactSyncService, PipelineSyncService, DealSyncService],
})
export class NotionModule {}