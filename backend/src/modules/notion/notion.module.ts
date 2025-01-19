// src/modules/notion/notion.module.ts
import { Module } from '@nestjs/common';
import { NotionService } from './notion.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from '../contacts/contact.entity';
import { ContactsModule } from '../contacts/contacts.module';
import { ContactSyncService } from './contact-sync.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Contact]),
  ContactsModule,],
  providers: [NotionService, ContactSyncService],
  exports: [NotionService, ContactSyncService],
})
export class NotionModule {}