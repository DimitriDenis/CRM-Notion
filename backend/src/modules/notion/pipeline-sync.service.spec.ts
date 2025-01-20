// src/modules/notion/pipeline-sync.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PipelineSyncService } from './pipeline-sync.service';
import { NotionService } from './notion.service';
import { PipelinesService } from '../pipelines/pipelines.service';
import { Pipeline } from '../pipelines/pipeline.entity';
import { Logger } from '@nestjs/common';
import { Deal } from '../deals/deal.entity';

describe('PipelineSyncService', () => {
  let service: PipelineSyncService;
  let notionService: NotionService;
  let pipelinesService: PipelinesService;
  let pipelineRepository: Repository<Pipeline>;

  const createMockDeal = (partial: Partial<Deal> = {}): Deal => {
    const deal = new Deal();
    return Object.assign(deal, {
      id: 'deal-1',
      name: 'Test Deal',
      value: 1000,
      stageId: 'stage-1',
      expectedCloseDate: new Date(),
      pipelineId: 'test-pipeline-id',
      userId: 'test-user-id',
      user: null,
      contacts: [],
      customFields: null,
      notionMetadata: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...partial
    });
  };
  
  const mockPipeline: Pipeline = {
    id: 'test-pipeline-id',
    name: 'Sales Pipeline',
    stages: [
      { id: 'stage-1', name: 'Lead', order: 1 },
      { id: 'stage-2', name: 'Negotiation', order: 2 },
      { id: 'stage-3', name: 'Closed', order: 3 }
    ],
    userId: 'test-user-id',
    user: null,
    deals: [
      createMockDeal({ id: 'deal-1', value: 1000 }),
      createMockDeal({ id: 'deal-2', value: 2000 })
    ],
    notionMetadata: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockNotionPage = {
    id: 'notion-page-id',
    properties: {
      Name: {
        title: [{ text: { content: 'Sales Pipeline' } }],
      },
      Stages: {
        multi_select: [
          { name: 'Lead' },
          { name: 'Negotiation' },
          { name: 'Closed' }
        ],
      },
      TotalValue: {
        number: 3000,
      },
      DealsCount: {
        number: 2,
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PipelineSyncService,
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
          provide: PipelinesService,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Pipeline),
          useValue: {
            update: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PipelineSyncService>(PipelineSyncService);
    notionService = module.get<NotionService>(NotionService);
    pipelinesService = module.get<PipelinesService>(PipelinesService);
    pipelineRepository = module.get<Repository<Pipeline>>(getRepositoryToken(Pipeline));

    // Mock du Logger
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  describe('initializePipelineDatabase', () => {
    const mockAccessToken = 'test-token';
    const mockWorkspaceId = 'workspace-id';
    const mockDatabaseId = 'database-id';

    it('should create a new Notion database successfully', async () => {
      const mockDatabase = { id: mockDatabaseId };
      jest.spyOn(notionService, 'createDatabase').mockResolvedValue(mockDatabase);
      jest.spyOn(pipelineRepository, 'update').mockResolvedValue(undefined);

      const result = await service.initializePipelineDatabase(
        mockPipeline.userId,
        mockAccessToken,
        mockWorkspaceId,
      );

      expect(notionService.createDatabase).toHaveBeenCalledWith(
        mockAccessToken,
        mockWorkspaceId,
        'CRM Pipelines',
        expect.any(Object),
      );
      expect(pipelineRepository.update).toHaveBeenCalled();
      expect(result).toEqual(mockDatabase);
    });

    it('should handle database creation errors', async () => {
      jest.spyOn(notionService, 'createDatabase').mockRejectedValue(new Error('API Error'));

      await expect(
        service.initializePipelineDatabase(mockPipeline.userId, mockAccessToken, mockWorkspaceId),
      ).rejects.toThrow('API Error');
    });
  });

  describe('syncPipelineToNotion', () => {
    const mockAccessToken = 'test-token';
    const mockDatabaseId = 'database-id';

    it('should create a new page for pipeline without Notion metadata', async () => {
      jest.spyOn(pipelinesService, 'findOne').mockResolvedValue(mockPipeline);
      jest.spyOn(notionService, 'createPage').mockResolvedValue({ id: 'new-page-id' });

      await service.syncPipelineToNotion(
        mockPipeline.userId,
        mockPipeline.id,
        mockAccessToken,
        mockDatabaseId,
      );

      expect(notionService.createPage).toHaveBeenCalled();
      expect(pipelineRepository.update).toHaveBeenCalledWith(
        { id: mockPipeline.id },
        expect.objectContaining({
          notionMetadata: expect.any(Object),
        }),
      );
    });

    it('should update existing Notion page for pipeline with metadata', async () => {
      const pipelineWithMetadata = {
        ...mockPipeline,
        notionMetadata: { pageId: 'existing-page-id', lastSync: new Date() },
      };
      jest.spyOn(pipelinesService, 'findOne').mockResolvedValue(pipelineWithMetadata);
      jest.spyOn(notionService, 'updatePage').mockResolvedValue({ id: 'existing-page-id' });

      await service.syncPipelineToNotion(
        pipelineWithMetadata.userId,
        pipelineWithMetadata.id,
        mockAccessToken,
        mockDatabaseId,
      );

      expect(notionService.updatePage).toHaveBeenCalled();
    });
  });

  describe('syncPipelineFromNotion', () => {
    const mockAccessToken = 'test-token';

    it('should sync pipeline data from Notion successfully', async () => {
      const pipelineWithMetadata = {
        ...mockPipeline,
        notionMetadata: { pageId: 'notion-page-id', lastSync: new Date() },
      };
      
      jest.spyOn(pipelinesService, 'findOne')
        .mockResolvedValueOnce(pipelineWithMetadata)
        .mockResolvedValueOnce(pipelineWithMetadata);
      jest.spyOn(notionService, 'getPage').mockResolvedValue(mockNotionPage);

      const result = await service.syncPipelineFromNotion(
        pipelineWithMetadata.userId,
        pipelineWithMetadata.id,
        mockAccessToken,
      );

      expect(notionService.getPage).toHaveBeenCalled();
      expect(pipelineRepository.update).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should handle pipelines not linked to Notion', async () => {
      jest.spyOn(pipelinesService, 'findOne').mockResolvedValue(mockPipeline);

      await expect(
        service.syncPipelineFromNotion(
          mockPipeline.userId,
          mockPipeline.id,
          mockAccessToken,
        ),
      ).rejects.toThrow('Pipeline not linked to Notion');
    });
  });

  describe('syncAllPipelines', () => {
    const mockAccessToken = 'test-token';
    const mockDatabaseId = 'database-id';

    it('should sync all pipelines successfully', async () => {
      jest.spyOn(pipelinesService, 'findAll').mockResolvedValue({
        items: [mockPipeline],
        total: 1,
      });
      jest.spyOn(service, 'syncPipelineToNotion').mockResolvedValue({ id: 'notion-page-id' });

      const result = await service.syncAllPipelines(
        mockPipeline.userId,
        mockAccessToken,
        mockDatabaseId,
      );

      expect(result).toHaveLength(1);
      expect(service.syncPipelineToNotion).toHaveBeenCalled();
    });

    it('should handle errors during bulk sync', async () => {
      jest.spyOn(pipelinesService, 'findAll').mockResolvedValue({
        items: [mockPipeline],
        total: 1,
      });
      jest.spyOn(service, 'syncPipelineToNotion').mockRejectedValue(new Error('Sync failed'));

      await expect(
        service.syncAllPipelines(mockPipeline.userId, mockAccessToken, mockDatabaseId),
      ).rejects.toThrow();
    });
  });

  describe('updateStages', () => {
    const mockAccessToken = 'test-token';

    it('should update stages successfully', async () => {
      const pipelineWithMetadata = {
        ...mockPipeline,
        notionMetadata: { 
          pageId: 'notion-page-id',
          databaseId: 'database-id',
          lastSync: new Date()
        },
      };

      const newStages = [
        { name: 'New Lead', order: 1 },
        { name: 'Meeting', order: 2 },
        { name: 'Won', order: 3 },
      ];

      jest.spyOn(pipelinesService, 'findOne').mockResolvedValue(pipelineWithMetadata);
      jest.spyOn(service, 'syncPipelineToNotion').mockResolvedValue({ id: 'notion-page-id' });

      await service.updateStages(
        pipelineWithMetadata.userId,
        pipelineWithMetadata.id,
        mockAccessToken,
        newStages,
      );

      expect(pipelineRepository.update).toHaveBeenCalledWith(
        { id: pipelineWithMetadata.id },
        expect.objectContaining({
          stages: expect.arrayContaining([
            expect.objectContaining({ name: 'New Lead' }),
          ]),
        }),
      );
      expect(service.syncPipelineToNotion).toHaveBeenCalled();
    });

    it('should handle pipeline not linked to Notion', async () => {
      jest.spyOn(pipelinesService, 'findOne').mockResolvedValue(mockPipeline);

      await expect(
        service.updateStages(
          mockPipeline.userId,
          mockPipeline.id,
          mockAccessToken,
          [],
        ),
      ).rejects.toThrow('Pipeline not linked to Notion');
    });
  });

  describe('data conversion', () => {
    it('should correctly convert pipeline to Notion properties', async () => {
      const properties = await service['convertToNotionProperties'](mockPipeline);
      
      expect(properties).toMatchObject({
        Name: {
          title: [{ text: { content: 'Sales Pipeline' } }],
        },
        Stages: {
          multi_select: expect.arrayContaining([
            expect.objectContaining({ name: 'Lead' }),
          ]),
        },
        TotalValue: {
          number: 3000,
        },
      });
    });

    it('should correctly convert Notion properties to pipeline data', () => {
      const pipelineData = service['convertFromNotionProperties'](mockNotionPage.properties);
      
      expect(pipelineData).toMatchObject({
        name: 'Sales Pipeline',
        stages: expect.arrayContaining([
          expect.objectContaining({ name: 'Lead', order: 1 }),
        ]),
      });
    });
  });
});