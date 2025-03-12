// src/modules/pipelines/pipelines.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipelinesController } from './pipelines.controller';
import { PipelinesService } from './pipelines.service';
import { Pipeline } from './pipeline.entity';
import { Deal } from '../deals/deal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pipeline]), TypeOrmModule.forFeature([Deal]),],
  controllers: [PipelinesController],
  providers: [PipelinesService],
  exports: [PipelinesService],
})
export class PipelinesModule {}