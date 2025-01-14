// src/modules/contacts/contacts.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsService } from './contacts.service';
import { Contact } from './contact.entity';
import { Tag } from '../tags/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, Tag])],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}