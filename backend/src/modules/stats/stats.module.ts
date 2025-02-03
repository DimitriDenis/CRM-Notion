// src/modules/stats/stats.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stats } from 'fs';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Contact } from '../contacts/contact.entity';
import { Deal } from '../deals/deal.entity';
import { ContactsModule } from '../contacts/contacts.module';
import { DealsModule } from '../deals/deals.module';


@Module({
  imports: [TypeOrmModule.forFeature([Contact, Deal]),
    ContactsModule,
    DealsModule],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}