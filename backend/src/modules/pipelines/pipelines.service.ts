// src/modules/pipelines/pipelines.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pipeline } from './pipeline.entity';
import { Deal } from '../deals/deal.entity';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PipelinesService {
  constructor(
    @InjectRepository(Pipeline)
    private pipelineRepository: Repository<Pipeline>,
    @InjectRepository(Deal) // Ajoutez cette injection
    private dealRepository: Repository<Deal>,
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
        id: stage.id || uuidv4(),
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
    // Récupérer le pipeline avec les deals
    const pipeline = await this.pipelineRepository.findOne({
      where: { id: pipelineId, userId },
      relations: ['deals'] // Seulement charger la relation deals
    });
  
    if (!pipeline) {
      throw new NotFoundException(`Pipeline with ID ${pipelineId} not found`);
    }
  
    // Calculer les statistiques pour chaque étape
    const stageStats = pipeline.stages.map(stage => {
      const dealsInStage = pipeline.deals?.filter(deal => deal.stageId === stage.id) || [];
      const stageValue = dealsInStage.reduce((sum, deal) => sum + (deal.value || 0), 0);
      
      return {
        id: stage.id,
        name: stage.name,
        count: dealsInStage.length,
        value: stageValue
      };
    });
  
    const totalDeals = pipeline.deals?.length || 0;
    const totalValue = pipeline.deals?.reduce((sum, deal) => sum + (deal.value || 0), 0) || 0;
  
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

  async getDealsForPipeline(userId: string, pipelineId: string) {
    const deals = await this.dealRepository.find({
      where: {
        pipelineId,
        userId
      },
      relations: ['contacts']
    });
    
    return {
      items: deals,
      total: deals.length
    };
  }
}