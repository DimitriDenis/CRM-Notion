// src/modules/deals/deals.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { Deal } from './deal.entity';
import { Contact } from '../contacts/contact.entity';
import { Pipeline } from '../pipelines/pipeline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deal, Contact, Pipeline])],
  controllers: [DealsController],
  providers: [DealsService],
  exports: [DealsService],
})
export class DealsModule {}