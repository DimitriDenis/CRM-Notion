// src/modules/notion/deal-sync.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DealSyncService } from './deal-sync.service';
import { NotionService } from './notion.service';
import { DealsService } from '../deals/deals.service';
import { Deal } from '../deals/deal.entity';
import { Logger } from '@nestjs/common';
import { Pipeline } from '../pipelines/pipeline.entity';
import { Contact } from '../contacts/contact.entity';

describe('DealSyncService', () => {
  let service: DealSyncService;
  let notionService: NotionService;
  let dealsService: DealsService;
  let dealRepository: Repository<Deal>;

  const createMockDeal = (partial: Partial<Deal> = {}): Deal => {
    const deal = new Deal();
    return Object.assign(deal, {
      id: 'test-deal-id',
      name: 'Big Deal',
      value: 10000,
      pipelineId: 'pipeline-1',
      stageId: 'stage-1',
      userId: 'test-user-id',
      expectedCloseDate: new Date('2024-12-31'),
      customFields: { priority: 'high' },
      user: null,
      pipeline: Object.assign(new Pipeline(), {
        id: 'pipeline-1',
        name: 'Main Pipeline',
        stages: [  
            { id: 'stage-1', name: 'Lead', order: 1 },
            { id: 'stage-2', name: 'Negotiation', order: 2 }
          ],
        notionMetadata: {
          pageId: 'notion-pipeline-page-id',
          lastSync: new Date(),
        },
        deals: [],  
      userId: 'test-user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      }),
      contacts: [
        Object.assign(new Contact(), {
          id: 'contact-1',
          firstName: 'John',
          lastName: 'Doe',
          notionMetadata: {
            pageId: 'notion-contact-page-id',
            lastSync: new Date(),
          },
        }),
      ],
      notionMetadata: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...partial
    });
  };
  
  const mockDeal = createMockDeal();

  const mockNotionPage = {
    id: 'notion-page-id',
    properties: {
      Name: {
        title: [{ text: { content: 'Big Deal' } }],
      },
      Value: {
        number: 10000,
      },
      Stage: {
        select: { name: 'Lead' },
      },
      Pipeline: {
        relation: [{ id: 'notion-pipeline-page-id' }],
      },
      Contacts: {
        relation: [{ id: 'notion-contact-page-id' }],
      },
      ExpectedCloseDate: {
        date: { start: '2024-12-31' },
      },
      Status: {
        select: { name: 'Active', color: 'green' },
      },
      CustomFields: {
        rich_text: [{ text: { content: '{"priority":"high"}' } }],
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DealSyncService,
        {
          provide: NotionService,
          useValue: {
            createDatabase: jest.fn(),
            createPage: jest.fn(),
            updatePage: jest.fn(),
            getPage: jest.fn(),
          },
        },
        {
          provide: DealsService,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Deal),
          useValue: {
            update: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DealSyncService>(DealSyncService);
    notionService = module.get<NotionService>(NotionService);
    dealsService = module.get<DealsService>(DealsService);
    dealRepository = module.get<Repository<Deal>>(getRepositoryToken(Deal));

    // Mock du Logger
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  describe('createDealDatabase', () => {
    const mockAccessToken = 'test-token';
    const mockWorkspaceId = 'workspace-id';
    const mockPipelineDatabaseId = 'pipeline-db-id';
    const mockContactDatabaseId = 'contact-db-id';

    it('should create a new Notion database for deals', async () => {
      const mockDatabase = { id: 'new-database-id' };
      jest.spyOn(notionService, 'createDatabase').mockResolvedValue(mockDatabase);

      const result = await service.createDealDatabase(
        mockDeal.userId,
        mockAccessToken,
        mockWorkspaceId,
        mockPipelineDatabaseId,
        mockContactDatabaseId,
      );

      expect(notionService.createDatabase).toHaveBeenCalledWith(
        mockAccessToken,
        mockWorkspaceId,
        'CRM Deals',
        expect.objectContaining({
          Pipeline: expect.objectContaining({
            relation: { database_id: mockPipelineDatabaseId },
          }),
        }),
      );
      expect(result).toEqual(mockDatabase);
    });

    it('should handle database creation errors', async () => {
      jest.spyOn(notionService, 'createDatabase').mockRejectedValue(new Error('API Error'));

      await expect(
        service.createDealDatabase(
          mockDeal.userId,
          mockAccessToken,
          mockWorkspaceId,
          mockPipelineDatabaseId,
          mockContactDatabaseId,
        ),
      ).rejects.toThrow();
    });
  });

  describe('syncDealToNotion', () => {
    const mockAccessToken = 'test-token';
    const mockDatabaseId = 'database-id';

    it('should create a new page for deal without Notion metadata', async () => {
      jest.spyOn(dealsService, 'findOne').mockResolvedValue(mockDeal);
      jest.spyOn(notionService, 'createPage').mockResolvedValue({ id: 'new-page-id' });

      await service.syncDealToNotion(
        mockDeal.userId,
        mockDeal.id,
        mockAccessToken,
        mockDatabaseId,
      );

      expect(notionService.createPage).toHaveBeenCalled();
      expect(dealRepository.update).toHaveBeenCalledWith(
        { id: mockDeal.id },
        expect.objectContaining({
          notionMetadata: expect.any(Object),
        }),
      );
    });

    it('should update existing Notion page for deal with metadata', async () => {
        const dealWithMetadata = createMockDeal({
            notionMetadata: { 
              pageId: 'existing-page-id',
              databaseId: 'database-id',
              lastSync: new Date()
            }
          });
      jest.spyOn(dealsService, 'findOne').mockResolvedValue(dealWithMetadata);
      jest.spyOn(notionService, 'updatePage').mockResolvedValue({ id: 'existing-page-id' });

      await service.syncDealToNotion(
        dealWithMetadata.userId,
        dealWithMetadata.id,
        mockAccessToken,
        mockDatabaseId,
      );

      expect(notionService.updatePage).toHaveBeenCalledWith(
        mockAccessToken,
        'existing-page-id',
        expect.any(Object),
      );
    });
  });

  describe('syncDealFromNotion', () => {
    const mockAccessToken = 'test-token';

    it('should sync deal data from Notion successfully', async () => {
        const dealWithMetadata = createMockDeal({
            notionMetadata: { 
              pageId: 'notion-page-id',
              databaseId: 'database-id',
              lastSync: new Date()
            }
          });

      jest.spyOn(dealsService, 'findOne')
        .mockResolvedValueOnce(dealWithMetadata)
        .mockResolvedValueOnce(dealWithMetadata);
      jest.spyOn(notionService, 'getPage').mockResolvedValue(mockNotionPage);

      const result = await service.syncDealFromNotion(
        dealWithMetadata.userId,
        dealWithMetadata.id,
        mockAccessToken,
      );

      expect(notionService.getPage).toHaveBeenCalledWith(
        mockAccessToken,
        'notion-page-id',
      );
      expect(dealRepository.update).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should handle deals not linked to Notion', async () => {
      jest.spyOn(dealsService, 'findOne').mockResolvedValue(mockDeal);

      await expect(
        service.syncDealFromNotion(mockDeal.userId, mockDeal.id, mockAccessToken),
      ).rejects.toThrow('Deal not linked to Notion');
    });
  });

  describe('syncAllDeals', () => {
    const mockAccessToken = 'test-token';
    const mockDatabaseId = 'database-id';

    it('should sync all deals successfully', async () => {
      jest.spyOn(dealsService, 'findAll').mockResolvedValue({
        items: [mockDeal],
        total: 1,
      });
      jest.spyOn(service, 'syncDealToNotion').mockResolvedValue({ id: 'notion-page-id' });

      const result = await service.syncAllDeals(
        mockDeal.userId,
        mockAccessToken,
        mockDatabaseId,
      );

      expect(result).toHaveLength(1);
      expect(service.syncDealToNotion).toHaveBeenCalled();
    });

    it('should handle errors during bulk sync', async () => {
      jest.spyOn(dealsService, 'findAll').mockResolvedValue({
        items: [mockDeal],
        total: 1,
      });
      jest.spyOn(service, 'syncDealToNotion').mockRejectedValue(new Error('Sync failed'));

      await expect(
        service.syncAllDeals(mockDeal.userId, mockAccessToken, mockDatabaseId),
      ).rejects.toThrow();
    });
  });

  describe('updateDealStage', () => {
    const mockAccessToken = 'test-token';
    const mockStageId = 'new-stage-id';

    it('should update deal stage and sync to Notion', async () => {
        const dealWithMetadata = createMockDeal({
            notionMetadata: { 
              pageId: 'notion-page-id',
              databaseId: 'database-id',
              lastSync: new Date()
            }
          });

      jest.spyOn(dealsService, 'findOne').mockResolvedValue(dealWithMetadata);
      jest.spyOn(service, 'syncDealToNotion').mockResolvedValue({ id: 'notion-page-id' });

      await service.updateDealStage(
        dealWithMetadata.userId,
        dealWithMetadata.id,
        mockAccessToken,
        mockStageId,
      );

      expect(dealRepository.update).toHaveBeenCalledWith(
        { id: dealWithMetadata.id },
        { stageId: mockStageId },
      );
      expect(service.syncDealToNotion).toHaveBeenCalled();
    });

    it('should handle deals not linked to Notion', async () => {
      jest.spyOn(dealsService, 'findOne').mockResolvedValue(mockDeal);

      await expect(
        service.updateDealStage(
          mockDeal.userId,
          mockDeal.id,
          mockAccessToken,
          mockStageId,
        ),
      ).rejects.toThrow('Deal not linked to Notion');
    });
  });

  describe('data conversion', () => {
    it('should correctly convert deal to Notion properties', async () => {
      const properties = await service['convertToNotionProperties'](mockDeal);
      
      expect(properties).toMatchObject({
        Name: {
          title: [{ text: { content: 'Big Deal' } }],
        },
        Value: {
          number: 10000,
        },
        Stage: {
          select: { name: 'Lead' },
        },
        ExpectedCloseDate: {
          date: { start: '2024-12-31' },
        },
      });
    });

    it('should correctly convert Notion properties to deal data', () => {
      const dealData = service['convertFromNotionProperties'](mockNotionPage.properties);
      
      expect(dealData).toMatchObject({
        name: 'Big Deal',
        value: 10000,
        expectedCloseDate: new Date('2024-12-31'),
        customFields: { priority: 'high' },
      });
    });

    it('should handle missing or incomplete properties', () => {
      const incompleteProperties = {
        Name: { title: [] },
        Value: { number: null },
      };

      const dealData = service['convertFromNotionProperties'](incompleteProperties);
      
      expect(dealData).toMatchObject({
        name: '',
        value: 0,
        customFields: {},
      });
    });
  });
});