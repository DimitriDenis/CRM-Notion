// src/modules/notion/deal-sync.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { NotionService } from './notion.service';
import { DealsService } from '../deals/deals.service';
import { Deal } from '../deals/deal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DealSyncService {
  private readonly logger = new Logger(DealSyncService.name);

  constructor(
    private readonly notionService: NotionService,
    private readonly dealsService: DealsService,
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,
  ) {}

  private convertToNotionProperties(deal: Deal) {
    return {
      Name: {
        title: [
          {
            text: {
              content: deal.name,
            },
          },
        ],
      },
      Value: {
        number: deal.value,
      },
      Stage: {
        select: {
          name: deal.stage?.name || '',
        },
      },
      Pipeline: {
        relation: [{
          id: deal.pipeline?.notionMetadata?.pageId || '',
        }],
      },
      Contacts: {
        relation: deal.contacts?.map(contact => ({
          id: contact.notionMetadata?.pageId || '',
        })) || [],
      },
      ExpectedCloseDate: deal.expectedCloseDate ? {
        date: {
          start: deal.expectedCloseDate.toISOString().split('T')[0],
        },
      } : null,
      Status: {
        select: {
          name: 'Active',
          color: 'green',
        },
      },
      CustomFields: {
        rich_text: [
          {
            text: {
              content: JSON.stringify(deal.customFields || {}),
            },
          },
        ],
      },
    };
  }

  private convertFromNotionProperties(properties: any): Partial<Deal> {
    return {
      name: properties.Name.title[0]?.text.content || '',
      value: properties.Value.number || 0,
      expectedCloseDate: properties.ExpectedCloseDate?.date?.start 
        ? new Date(properties.ExpectedCloseDate.date.start)
        : null,
      customFields: properties.CustomFields?.rich_text[0]?.text.content
        ? JSON.parse(properties.CustomFields.rich_text[0].text.content)
        : {},
    };
  }

  async createDealDatabase(
    userId: string,
    accessToken: string,
    workspaceId: string,
    pipelineDatabaseId: string,
    contactDatabaseId: string,
  ) {
    try {
      const dealSchema = {
        Name: {
          title: {},
        },
        Value: {
          number: {
            format: 'dollar',
          },
        },
        Stage: {
          select: {
            options: [],
          },
        },
        Pipeline: {
          relation: {
            database_id: pipelineDatabaseId,
          },
        },
        Contacts: {
          relation: {
            database_id: contactDatabaseId,
          },
        },
        ExpectedCloseDate: {
          date: {},
        },
        Status: {
          select: {
            options: [
              { name: 'Active', color: 'green' },
              { name: 'Won', color: 'blue' },
              { name: 'Lost', color: 'red' },
            ],
          },
        },
        CustomFields: {
          rich_text: {},
        },
      };

      const database = await this.notionService.createDatabase(
        accessToken,
        workspaceId,
        'CRM Deals',
        dealSchema,
      );

      await this.dealRepository.update(
        { userId },
        {
          notionMetadata: {
            databaseId: database.id,
            lastSync: new Date(),
          },
        },
      );

      return database;
    } catch (error) {
      this.logger.error('Failed to create deal database:', error);
      throw error;
    }
  }

  async syncDealToNotion(
    userId: string,
    dealId: string,
    accessToken: string,
    databaseId: string,
  ) {
    try {
      const deal = await this.dealsService.findOne(userId, dealId);
      const properties = this.convertToNotionProperties(deal);

      if (!deal.notionMetadata?.pageId) {
        // Création d'une nouvelle page
        const page = await this.notionService.createPage(
          accessToken,
          databaseId,
          properties,
        );

        await this.dealRepository.update(
          { id: dealId },
          {
            notionMetadata: {
              pageId: page.id,
              lastSync: new Date(),
            },
          },
        );

        return page;
      } else {
        // Mise à jour d'une page existante
        return await this.notionService.updatePage(
          accessToken,
          deal.notionMetadata.pageId,
          properties,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to sync deal ${dealId} to Notion:`, error);
      throw error;
    }
  }

  async syncDealFromNotion(
    userId: string,
    dealId: string,
    accessToken: string,
  ) {
    try {
      const deal = await this.dealsService.findOne(userId, dealId);
      if (!deal.notionMetadata?.pageId) {
        throw new Error('Deal not linked to Notion');
      }

      const page = await this.notionService.getPage(
        accessToken,
        deal.notionMetadata.pageId,
      );

      const dealData = this.convertFromNotionProperties(page.properties);

      await this.dealRepository.update(
        { id: dealId },
        {
          ...dealData,
          notionMetadata: {
            ...deal.notionMetadata,
            lastSync: new Date(),
          },
        },
      );

      return await this.dealsService.findOne(userId, dealId);
    } catch (error) {
      this.logger.error(`Failed to sync deal ${dealId} from Notion:`, error);
      throw error;
    }
  }

  async syncAllDeals(userId: string, accessToken: string, databaseId: string) {
    try {
      const deals = await this.dealsService.findAll(userId, {});
      const results = await Promise.all(
        deals.items.map(deal =>
          this.syncDealToNotion(userId, deal.id, accessToken, databaseId)
        )
      );

      return results;
    } catch (error) {
      this.logger.error('Failed to sync all deals:', error);
      throw error;
    }
  }

  async updateDealStage(
    userId: string,
    dealId: string,
    accessToken: string,
    stageId: string,
  ) {
    try {
      const deal = await this.dealsService.findOne(userId, dealId);
      if (!deal.notionMetadata?.pageId) {
        throw new Error('Deal not linked to Notion');
      }

      // Mettre à jour le stage localement
      await this.dealRepository.update(
        { id: dealId },
        { stageId }
      );

      // Synchroniser avec Notion
      return this.syncDealToNotion(
        userId,
        dealId,
        accessToken,
        deal.notionMetadata.databaseId,
      );
    } catch (error) {
      this.logger.error(`Failed to update stage for deal ${dealId}:`, error);
      throw error;
    }
  }
}