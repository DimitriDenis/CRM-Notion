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

  async getPipelineStats(userId: string, pipelineId: string) {
    const pipeline = await this.pipelineRepository.findOne({
      where: { id: pipelineId, userId },
      relations: ['stages', 'deals'],
    });
  
    if (!pipeline) {
      throw new NotFoundException(`Pipeline with ID ${pipelineId} not found`);
    }
  
    // Calculez les statistiques par étape
    const stageStats = [];
    let totalDeals = 0;
    let totalValue = 0;
  
    for (const stage of pipeline.stages) {
      const dealsInStage = pipeline.deals?.filter(deal => deal.stageId === stage.id) || [];
      const stageValue = dealsInStage.reduce((sum, deal) => sum + (deal.value || 0), 0);
      
      totalDeals += dealsInStage.length;
      totalValue += stageValue;
      
      stageStats.push({
        id: stage.id,
        name: stage.name,
        count: dealsInStage.length,
        value: stageValue
      });
    }
  
    return {
      id: pipeline.id,
      name: pipeline.name,
      stages: stageStats,
      totalDeals,
      totalValue
    };
  }

  async getPipelineOverview(userId: string) {
    try {
      // Votre code existant pour trouver les pipelines
      const pipelines = await this.pipelineRepository.find({
        where: { userId },
        relations: ['deals'], // Charger les deals associés
      });
  
      // Si aucun pipeline n'est trouvé, renvoyer un objet vide
      if (!pipelines || pipelines.length === 0) {
        return { 
          stages: [],
          deals: []
        };
      }
  
      // Votre logique existante pour traiter les pipelines
      const pipeline = pipelines[0]; // Prendre le premier pipeline (ou celui par défaut)
      
      // Traitement des données...
      
      // Renvoyer le résultat formaté
      return {
        stages: pipeline.stages || [],
        deals: pipeline.deals || []
      };
    } catch (error) {
      console.error('Error in getPipelineOverview:', error);
      // En cas d'erreur, renvoyer un objet par défaut
      return { 
        stages: [],
        deals: []
      };
    }
  }
}