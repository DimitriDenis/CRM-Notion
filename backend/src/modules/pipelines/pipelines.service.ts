// src/modules/pipelines/pipelines.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pipeline } from './pipeline.entity';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';

@Injectable()
export class PipelinesService {
  constructor(
    @InjectRepository(Pipeline)
    private pipelineRepository: Repository<Pipeline>,
  ) {}

  async create(userId: string, createPipelineDto: CreatePipelineDto): Promise<Pipeline> {
    const pipeline = this.pipelineRepository.create({
      ...createPipelineDto,
      userId,
      stages: createPipelineDto.stages.map(stage => ({
        ...stage,
        id: crypto.randomUUID(),
      })),
    });

    return this.pipelineRepository.save(pipeline);
  }

  async findAll(userId: string, options: {
    skip?: number;
    take?: number;
  } = {}): Promise<{ items: Pipeline[]; total: number }> {
    const skip = options.skip ? Number(options.skip) : 0;
    const take = options.take ? Number(options.take) : 10;
    
    const [items, total] = await this.pipelineRepository.findAndCount({
      where: { userId },
      skip: options.skip,
      take: options.take,
      order: { createdAt: 'DESC' },
      relations: ['deals'],
    });

    return { items, total };
  }

  async findOne(userId: string, id: string): Promise<Pipeline> {
    const pipeline = await this.pipelineRepository.findOne({
      where: { id, userId },
      relations: ['deals'],
    });

    if (!pipeline) {
      throw new NotFoundException(`Pipeline #${id} not found`);
    }

    return pipeline;
  }

  async update(
    userId: string,
    id: string,
    updatePipelineDto: UpdatePipelineDto,
  ): Promise<Pipeline> {
    const pipeline = await this.findOne(userId, id);
    
    if (updatePipelineDto.stages) {
      updatePipelineDto.stages = updatePipelineDto.stages.map(stage => ({
        ...stage,
        id: stage.id || crypto.randomUUID(),
      }));
    }

    Object.assign(pipeline, updatePipelineDto);
    return this.pipelineRepository.save(pipeline);
  }

  async remove(userId: string, id: string): Promise<void> {
    const pipeline = await this.findOne(userId, id);
    await this.pipelineRepository.remove(pipeline);
  }

  async countByUser(userId: string): Promise<number> {
    return this.pipelineRepository.count({
      where: { userId },
    });
  }
}