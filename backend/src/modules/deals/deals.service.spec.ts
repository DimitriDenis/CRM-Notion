// src/modules/deals/deals.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { DealsService } from './deals.service';
import { Deal } from './deal.entity';
import { Contact } from '../contacts/contact.entity';
import { Pipeline } from '../pipelines/pipeline.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('DealsService', () => {
  let service: DealsService;
  let dealRepository: Repository<Deal>;
  let contactRepository: Repository<Contact>;
  let pipelineRepository: Repository<Pipeline>;

  const mockUserId = 'test-user-id';
 // Helper pour créer un mock Pipeline
 const createMockPipeline = (): Pipeline => {
    const pipeline = new Pipeline();
    return Object.assign(pipeline, {
      id: 'test-pipeline-id',
      name: 'Test Pipeline',
      stages: [
        { id: 'stage-1', name: 'Lead', order: 1 },
        { id: 'stage-2', name: 'Negotiation', order: 2 }
      ],
      userId: mockUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deals: [],
      user: null,
      notionMetadata: null
    });
  };

 // Helper pour créer un mock Deal
 const createMockDeal = (): Deal => {
    const deal = new Deal();
    return Object.assign(deal, {
      id: 'test-deal-id',
      name: 'Test Deal',
      value: 1000,
      pipelineId: 'test-pipeline-id',
      stageId: 'stage-1',
      userId: mockUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
      pipeline: createMockPipeline(),
      contacts: [],
      expectedCloseDate: null,
      customFields: null,
      notionMetadata: null
    });
  };

  const mockPipeline = createMockPipeline();
  const mockDeal = createMockDeal();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DealsService,
        {
          provide: getRepositoryToken(Deal),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findBy: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn().mockImplementation(() => Promise.resolve([[createMockDeal()], 1])),
              select: jest.fn().mockReturnThis(),
              getRawOne: jest.fn(),
            })),
            remove: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Contact),
          useValue: {
            findBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Pipeline),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DealsService>(DealsService);
    dealRepository = module.get<Repository<Deal>>(getRepositoryToken(Deal));
    contactRepository = module.get<Repository<Contact>>(getRepositoryToken(Contact));
    pipelineRepository = module.get<Repository<Pipeline>>(getRepositoryToken(Pipeline));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDealDto = {
      name: 'New Deal',
      value: 1000,
      pipelineId: mockPipeline.id,
      stageId: 'stage-1',
      contactIds: ['contact-1'],
    };
  
    it('should create a deal successfully', async () => {
      const newDeal = createMockDeal();
      jest.spyOn(pipelineRepository, 'findOne').mockResolvedValue(createMockPipeline());
      jest.spyOn(contactRepository, 'findBy').mockResolvedValue([
        { id: 'contact-1' } as Contact
      ]);
      jest.spyOn(dealRepository, 'create').mockReturnValue(newDeal);
      jest.spyOn(dealRepository, 'save').mockResolvedValue(newDeal);
      jest.spyOn(service, 'findOne').mockResolvedValue(newDeal);
  
      const result = await service.create(mockUserId, createDealDto);
  
      expect(result).toEqual(newDeal);
      expect(contactRepository.findBy).toHaveBeenCalledWith({
        id: In(['contact-1']),
        userId: mockUserId,
      });
    });

    it('should throw BadRequestException if pipeline not found', async () => {
      jest.spyOn(pipelineRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(mockUserId, createDealDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if stage not found in pipeline', async () => {
      const invalidDealDto = { ...createDealDto, stageId: 'invalid-stage' };
      jest.spyOn(pipelineRepository, 'findOne').mockResolvedValue(mockPipeline);

      await expect(service.create(mockUserId, invalidDealDto))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated deals', async () => {
      const mockDeals = [createMockDeal()];
      const mockTotal = 1;
      const queryBuilder = dealRepository.createQueryBuilder();
      jest.spyOn(queryBuilder, 'getManyAndCount').mockResolvedValue([mockDeals, mockTotal]);
  
      const result = await service.findAll(mockUserId, { skip: 0, take: 10 });
  
      expect(result).toEqual({
        items: mockDeals,
        total: mockTotal,
      });
    });

    it('should apply search filters', async () => {
      const mockDeals = [mockDeal];
      const mockTotal = 1;
      const queryBuilder = dealRepository.createQueryBuilder();
      jest.spyOn(queryBuilder, 'getManyAndCount').mockResolvedValue([mockDeals, mockTotal]);

      await service.findAll(mockUserId, {
        search: 'test',
        pipelineId: 'pipeline-1',
        stageId: 'stage-1',
      });

      expect(queryBuilder.andWhere).toHaveBeenCalledTimes(3);
    });
  });

  describe('findOne', () => {
    it('should return a deal by id', async () => {
      const mockFoundDeal = createMockDeal();
      jest.spyOn(dealRepository, 'findOne').mockResolvedValue(mockFoundDeal);
  
      const result = await service.findOne(mockUserId, mockFoundDeal.id);
  
      expect(dealRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockFoundDeal.id, userId: mockUserId },
        relations: ['contacts', 'pipeline'],
      });
      expect(result).toEqual(mockFoundDeal);
    });

    it('should throw NotFoundException if deal not found', async () => {
      jest.spyOn(dealRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(mockUserId, 'non-existent-id'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDealDto = {
      name: 'Updated Deal',
      stageId: 'stage-2',
    };
  
    it('should update a deal', async () => {
      const mockInitialDeal = createMockDeal();
      const updatedDeal = createMockDeal();
      Object.assign(updatedDeal, updateDealDto);
  
      jest.spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockInitialDeal)
        .mockResolvedValueOnce(updatedDeal);
      jest.spyOn(dealRepository, 'save').mockResolvedValue(updatedDeal);
  
      const result = await service.update(mockUserId, mockDeal.id, updateDealDto);
  
      expect(dealRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockInitialDeal,
          ...updateDealDto,
        })
      );
      expect(result).toEqual(updatedDeal);
    });
  });

  describe('getTotalValue', () => {
    it('should return total value of deals', async () => {
      const mockTotal = 5000;
      const queryBuilder = dealRepository.createQueryBuilder();
      jest.spyOn(queryBuilder, 'getRawOne').mockResolvedValue({ total: mockTotal });

      const result = await service.getTotalValue(mockUserId);

      expect(result).toBe(mockTotal);
    });

    it('should return 0 if no deals found', async () => {
      const queryBuilder = dealRepository.createQueryBuilder();
      jest.spyOn(queryBuilder, 'getRawOne').mockResolvedValue({ total: null });

      const result = await service.getTotalValue(mockUserId);

      expect(result).toBe(0);
    });
  });
});