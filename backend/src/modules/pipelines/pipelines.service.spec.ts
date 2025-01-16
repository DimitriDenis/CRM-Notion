// src/modules/pipelines/pipelines.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PipelinesService } from './pipelines.service';
import { Pipeline } from './pipeline.entity';
import { NotFoundException } from '@nestjs/common';

describe('PipelinesService', () => {
  let service: PipelinesService;
  let repository: Repository<Pipeline>;

  const mockUserId = 'test-user-id';
  // Helper pour créer un mock Pipeline
  const createMockPipeline = (): Pipeline => {
    const pipeline = new Pipeline();
    return Object.assign(pipeline, {
      id: 'test-pipeline-id',
      name: 'Sales Pipeline',
      stages: [
        { id: 'stage-1', name: 'Lead', order: 1 },
        { id: 'stage-2', name: 'Contact Made', order: 2 },
        { id: 'stage-3', name: 'Negotiation', order: 3 }
      ],
      userId: mockUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deals: [],
      user: null,
      notionMetadata: null
    });
  };

  const mockPipeline = createMockPipeline();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PipelinesService,
        {
          provide: getRepositoryToken(Pipeline),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PipelinesService>(PipelinesService);
    repository = module.get<Repository<Pipeline>>(getRepositoryToken(Pipeline));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPipelineDto = {
      name: 'Sales Pipeline',
      stages: [
        { name: 'Lead', order: 1 },
        { name: 'Contact Made', order: 2 },
        { name: 'Negotiation', order: 3 }
      ],
    };

    it('should create a pipeline with stages', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(mockPipeline);
      jest.spyOn(repository, 'save').mockResolvedValue(mockPipeline);

      const result = await service.create(mockUserId, createPipelineDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createPipelineDto,
        userId: mockUserId,
        stages: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: 'Lead',
            order: 1,
          }),
        ]),
      });
      expect(result).toEqual(mockPipeline);
    });
  });

  describe('findAll', () => {
    it('should return paginated pipelines', async () => {
      const paginationOptions = { skip: 0, take: 10 };
      const mockPipelines = [mockPipeline];
      const mockTotal = 1;

      jest.spyOn(repository, 'findAndCount').mockResolvedValue([mockPipelines, mockTotal]);

      const result = await service.findAll(mockUserId, paginationOptions);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        skip: paginationOptions.skip,
        take: paginationOptions.take,
        order: { createdAt: 'DESC' },
        relations: ['deals'],
      });
      expect(result).toEqual({
        items: mockPipelines,
        total: mockTotal,
      });
    });
  });

  describe('findOne', () => {
    it('should return a pipeline by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPipeline);

      const result = await service.findOne(mockUserId, mockPipeline.id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockPipeline.id, userId: mockUserId },
        relations: ['deals'],
      });
      expect(result).toEqual(mockPipeline);
    });

    it('should throw NotFoundException if pipeline not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.findOne(mockUserId, 'non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updatePipelineDto = {
      name: 'Updated Pipeline',
      stages: [
        { id: 'stage-1', name: 'New Lead', order: 1 },
        { id: 'stage-2', name: 'Updated Stage', order: 2 }
      ],
    };

    it('should update a pipeline', async () => {
      const updatedPipeline = { ...mockPipeline, ...updatePipelineDto };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPipeline);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedPipeline);

      const result = await service.update(mockUserId, mockPipeline.id, updatePipelineDto);

      expect(service.findOne).toHaveBeenCalledWith(mockUserId, mockPipeline.id);
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        ...mockPipeline,
        ...updatePipelineDto,
      }));
      expect(result).toEqual(updatedPipeline);
    });

    it('should throw NotFoundException if pipeline not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(
        service.update(mockUserId, 'non-existent-id', updatePipelineDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a pipeline', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPipeline);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockPipeline);

      await service.remove(mockUserId, mockPipeline.id);

      expect(service.findOne).toHaveBeenCalledWith(mockUserId, mockPipeline.id);
      expect(repository.remove).toHaveBeenCalledWith(mockPipeline);
    });

    it('should throw NotFoundException if pipeline not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(
        service.remove(mockUserId, 'non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('countByUser', () => {
    it('should return total count of user pipelines', async () => {
      const mockCount = 5;
      jest.spyOn(repository, 'count').mockResolvedValue(mockCount);

      const result = await service.countByUser(mockUserId);

      expect(repository.count).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
      expect(result).toBe(mockCount);
    });
  });
});