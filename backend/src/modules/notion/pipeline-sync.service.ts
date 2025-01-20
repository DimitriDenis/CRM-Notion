// src/modules/notion/pipeline-sync.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { NotionService } from './notion.service';
import { PipelinesService } from '../pipelines/pipelines.service';
import { PIPELINE_DATABASE_SCHEMA } from './constants/database-schemas';
import { Pipeline } from '../pipelines/pipeline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PipelineSyncService {
  private readonly logger = new Logger(PipelineSyncService.name);

  constructor(
    private readonly notionService: NotionService,
    private readonly pipelinesService: PipelinesService,
    @InjectRepository(Pipeline)
    private readonly pipelineRepository: Repository<Pipeline>,
  ) {}

  private convertToNotionProperties(pipeline: Pipeline) {
    return {
      Name: {
        title: [
          {
            text: {
              content: pipeline.name,
            },
          },
        ],
      },
      Stages: {
        multi_select: pipeline.stages.map(stage => ({
          name: stage.name,
          color: 'default',
        })),
      },
      TotalValue: {
        number: pipeline.deals?.reduce((sum, deal) => sum + deal.value, 0) || 0,
      },
      DealsCount: {
        number: pipeline.deals?.length || 0,
      },
    };
  }

  private convertFromNotionProperties(properties: any): Partial<Pipeline> {
    return {
      name: properties.Name.title[0]?.text.content || '',
      stages: properties.Stages.multi_select.map((stage: any, index: number) => ({
        id: `stage-${index + 1}`,
        name: stage.name,
        order: index + 1,
      })),
    };
  }

  async initializePipelineDatabase(userId: string, accessToken: string, workspaceId: string) {
    try {
      // Créer la base de données Notion pour les pipelines
      const database = await this.notionService.createDatabase(
        accessToken,
        workspaceId,
        'CRM Pipelines',
        PIPELINE_DATABASE_SCHEMA,
      );

      // Sauvegarder l'ID de la base de données
      await this.pipelineRepository.update(
        { userId },
        { 
          notionMetadata: { 
            databaseId: database.id, 
            lastSync: new Date() 
          }
        }
      );

      return database;
    } catch (error) {
      this.logger.error('Failed to initialize pipeline database:', error);
      throw error;
    }
  }

  async syncPipelineToNotion(
    userId: string,
    pipelineId: string,
    accessToken: string,
    databaseId: string,
  ) {
    try {
      const pipeline = await this.pipelinesService.findOne(userId, pipelineId);
      const properties = this.convertToNotionProperties(pipeline);

      if (!pipeline.notionMetadata?.pageId) {
        // Création d'une nouvelle page
        const page = await this.notionService.createPage(
          accessToken,
          databaseId,
          properties,
        );

        // Mettre à jour les métadonnées du pipeline
        await this.pipelineRepository.update(
          { id: pipelineId },
          { 
            notionMetadata: { 
              pageId: page.id,
              lastSync: new Date(),
            }
          }
        );

        return page;
      } else {
        // Mise à jour d'une page existante
        return await this.notionService.updatePage(
          accessToken,
          pipeline.notionMetadata.pageId,
          properties,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to sync pipeline ${pipelineId} to Notion:`, error);
      throw error;
    }
  }

  async syncPipelineFromNotion(
    userId: string,
    pipelineId: string,
    accessToken: string,
  ) {
    try {
      const pipeline = await this.pipelinesService.findOne(userId, pipelineId);
      if (!pipeline.notionMetadata?.pageId) {
        throw new Error('Pipeline not linked to Notion');
      }

      const page = await this.notionService.getPage(
        accessToken,
        pipeline.notionMetadata.pageId,
      );

      const pipelineData = this.convertFromNotionProperties(page.properties);

      // Mise à jour du pipeline avec préservation des relations existantes
      await this.pipelineRepository.update(
        { id: pipelineId },
        {
          ...pipelineData,
          notionMetadata: {
            ...pipeline.notionMetadata,
            lastSync: new Date(),
          }
        }
      );

      return await this.pipelinesService.findOne(userId, pipelineId);
    } catch (error) {
      this.logger.error(`Failed to sync pipeline ${pipelineId} from Notion:`, error);
      throw error;
    }
  }

  async syncAllPipelines(userId: string, accessToken: string, databaseId: string) {
    try {
      const pipelines = await this.pipelinesService.findAll(userId, {});
      const results = await Promise.all(
        pipelines.items.map(pipeline =>
          this.syncPipelineToNotion(userId, pipeline.id, accessToken, databaseId)
        )
      );

      return results;
    } catch (error) {
      this.logger.error('Failed to sync all pipelines:', error);
      throw error;
    }
  }

  async updateStages(
    userId: string,
    pipelineId: string,
    accessToken: string,
    stages: { name: string; order: number }[],
  ) {
    try {
      const pipeline = await this.pipelinesService.findOne(userId, pipelineId);
      if (!pipeline.notionMetadata?.pageId) {
        throw new Error('Pipeline not linked to Notion');
      }

      // Mettre à jour les stages localement
      await this.pipelineRepository.update(
        { id: pipelineId },
        { 
          stages: stages.map(stage => ({
            ...stage,
            id: `stage-${stage.order}`,
          })),
        }
      );

      // Mettre à jour Notion
      return this.syncPipelineToNotion(
        userId,
        pipelineId,
        accessToken,
        pipeline.notionMetadata.databaseId,
      );
    } catch (error) {
      this.logger.error(`Failed to update stages for pipeline ${pipelineId}:`, error);
      throw error;
    }
  }
}