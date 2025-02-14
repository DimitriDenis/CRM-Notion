// src/modules/deals/deals.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Deal } from './deal.entity';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { FindDealsDto } from './dto/find-deals.dto';
import { Contact } from '../contacts/contact.entity';
import { Pipeline } from '../pipelines/pipeline.entity';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal)
    private dealRepository: Repository<Deal>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(Pipeline)
    private pipelineRepository: Repository<Pipeline>,
  ) {}

  async create(userId: string, createDealDto: CreateDealDto): Promise<Deal> {
    const { contactIds, ...dealData } = createDealDto;

    // Vérifier que le pipeline existe et appartient à l'utilisateur
    const pipeline = await this.pipelineRepository.findOne({
      where: { id: dealData.pipelineId, userId },
    });
    if (!pipeline) {
      throw new BadRequestException('Pipeline not found');
    }

    // Vérifier que le stage existe dans le pipeline
    const stageExists = pipeline.stages.some(stage => stage.id === dealData.stageId);
    if (!stageExists) {
      throw new BadRequestException('Stage not found in pipeline');
    }

    const deal = this.dealRepository.create({
      ...dealData,
      userId,
    });

    if (contactIds?.length) {
      const contacts = await this.contactRepository.findBy({
        id: In(contactIds),
        userId,
      });
      if (contacts.length !== contactIds.length) {
        throw new BadRequestException('Some contacts were not found');
      }
      deal.contacts = contacts;
    }

    await this.dealRepository.save(deal);
    return this.findOne(userId, deal.id);
  }

  async findAll(userId: string, options: FindDealsDto = {}): Promise<{ items: Deal[]; total: number }> {
    const { skip = 0, take = 10, pipelineId, stageId, search } = options;

    const queryBuilder = this.dealRepository
      .createQueryBuilder('deal')
      .leftJoinAndSelect('deal.contacts', 'contact')
      .leftJoinAndSelect('deal.pipeline', 'pipeline')
      .where('deal.userId = :userId', { userId });

    if (pipelineId) {
      queryBuilder.andWhere('deal.pipelineId = :pipelineId', { pipelineId });
    }

    if (stageId) {
      queryBuilder.andWhere('deal.stageId = :stageId', { stageId });
    }

    if (search) {
      queryBuilder.andWhere('deal.name ILIKE :search', { search: `%${search}%` });
    }

    queryBuilder
      .orderBy('deal.createdAt', 'DESC')
      .skip(skip)
      .take(take);

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  async findOne(userId: string, id: string): Promise<Deal> {
    const deal = await this.dealRepository.findOne({
      where: { id, userId },
      relations: ['contacts', 'pipeline'],
    });

    if (!deal) {
      throw new NotFoundException(`Deal #${id} not found`);
    }

    return deal;
  }

  async update(userId: string, id: string, updateDealDto: UpdateDealDto): Promise<Deal> {
    const deal = await this.findOne(userId, id);
    const { contactIds, ...updateData } = updateDealDto;

    if (updateData.pipelineId) {
      const pipeline = await this.pipelineRepository.findOne({
        where: { id: updateData.pipelineId, userId },
      });
      if (!pipeline) {
        throw new BadRequestException('Pipeline not found');
      }

      if (updateData.stageId) {
        const stageExists = pipeline.stages.some(stage => stage.id === updateData.stageId);
        if (!stageExists) {
          throw new BadRequestException('Stage not found in pipeline');
        }
      }
    }

    if (contactIds !== undefined) {
      const contacts = await this.contactRepository.findBy({
        id: In(contactIds || []),
        userId,
      });
      if (contactIds?.length && contacts.length !== contactIds.length) {
        throw new BadRequestException('Some contacts were not found');
      }
      deal.contacts = contacts;
    }

    Object.assign(deal, updateData);
    await this.dealRepository.save(deal);
    return this.findOne(userId, id);
  }

  async remove(userId: string, id: string): Promise<void> {
    const deal = await this.findOne(userId, id);
    await this.dealRepository.remove(deal);
  }

  async countByUser(userId: string): Promise<number> {
    return this.dealRepository.count({
      where: { userId },
    });
  }

  async getTotalValue(userId: string): Promise<number> {
    const result = await this.dealRepository
      .createQueryBuilder('deal')
      .where('deal.userId = :userId', { userId })
      .select('SUM(deal.value)', 'total')
      .getRawOne();

    return result.total || 0;
  }

  async getRecentDeals(userId: string, limit = 5) {
    try {
      console.log('Fetching recent deals for user:', userId);
      
      const deals = await this.dealRepository.find({
        where: { userId },
        order: { updatedAt: 'DESC' },
        take: limit,
        relations: {
          pipeline: true
        },
      });
  
      return deals.map(deal => ({
        id: deal.id,
        name: deal.name,
        value: Number(deal.value),
        stage: deal.stage?.name || deal.stageId,
        updatedAt: deal.updatedAt.toISOString(),
        pipeline: deal.pipeline ? {
          id: deal.pipeline.id,
          name: deal.pipeline.name,
          stages: deal.pipeline.stages
        } : undefined
      }));
    } catch (error) {
      console.error('Error in getRecentDeals service:', error);
      throw error;
    }
  }
}