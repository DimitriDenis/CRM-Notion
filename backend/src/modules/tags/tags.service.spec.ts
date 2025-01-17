// src/modules/tags/tags.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagsService } from './tags.service';
import { Tag } from './tag.entity';
import { NotFoundException } from '@nestjs/common';

describe('TagsService', () => {
  let service: TagsService;
  let repository: Repository<Tag>;
  

  const mockUserId = 'test-user-id';
  // Helper pour créer un mock Tag
  const createMockTag = (partial: Partial<Tag> = {}): Tag => {
    const tag = new Tag();
    return Object.assign(tag, {
      id: 'test-tag-id',
      name: 'Important',
      color: '#FF0000',
      userId: mockUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
      contacts: [], // Ajout de la relation contacts
      ...partial,
    });
  };

  const mockTag = createMockTag();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: getRepositoryToken(Tag),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn().mockResolvedValue([[createMockTag()], 1])
            })),
            remove: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    repository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tag', async () => {
      const createTagDto = {
        name: 'Important',
        color: '#FF0000',
      };

      jest.spyOn(repository, 'create').mockReturnValue(mockTag);
      jest.spyOn(repository, 'save').mockResolvedValue(mockTag);

      const result = await service.create(mockUserId, createTagDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createTagDto,
        userId: mockUserId,
      });
      expect(result).toEqual(mockTag);
    });

    it('should create a tag without color', async () => {
      const createTagDto = {
        name: 'Important',
      };

      const tagWithoutColor = { ...mockTag, color: undefined };
      jest.spyOn(repository, 'create').mockReturnValue(tagWithoutColor);
      jest.spyOn(repository, 'save').mockResolvedValue(tagWithoutColor);

      const result = await service.create(mockUserId, createTagDto);

      expect(result).toEqual(tagWithoutColor);
    });
  });

  describe('findAll', () => {
    it('should return paginated tags', async () => {
      const mockTags = [mockTag];
      const mockTotal = 1;
      const queryBuilder = repository.createQueryBuilder();
      jest.spyOn(queryBuilder, 'getManyAndCount').mockResolvedValue([mockTags, mockTotal]);

      const result = await service.findAll(mockUserId, { skip: 0, take: 10 });

      expect(result).toMatchObject({
        items: [
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            color: expect.any(String),
            userId: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            contacts: expect.any(Array),
          }),
        ],
        total: mockTotal,
      });
    });

    it('should apply search filter', async () => {
      const mockTags = [mockTag];
      const mockTotal = 1;
      const queryBuilder = repository.createQueryBuilder();
      jest.spyOn(queryBuilder, 'getManyAndCount').mockResolvedValue([mockTags, mockTotal]);

      await service.findAll(mockUserId, {
        search: 'Important',
      });

      expect(queryBuilder.andWhere).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a tag by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTag);

      const result = await service.findOne(mockUserId, mockTag.id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockTag.id, userId: mockUserId },
      });
      expect(result).toEqual(mockTag);
    });

    it('should throw NotFoundException if tag not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.findOne(mockUserId, 'non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateTagDto = {
      name: 'Updated Tag',
      color: '#00FF00',
    };

    it('should update a tag', async () => {
      const updatedTag = { ...mockTag, ...updateTagDto };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTag);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedTag);

      const result = await service.update(mockUserId, mockTag.id, updateTagDto);

      expect(service.findOne).toHaveBeenCalledWith(mockUserId, mockTag.id);
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        ...mockTag,
        ...updateTagDto,
      }));
      expect(result).toEqual(updatedTag);
    });

    it('should throw NotFoundException if tag not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(
        service.update(mockUserId, 'non-existent-id', updateTagDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a tag', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTag);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockTag);

      await service.remove(mockUserId, mockTag.id);

      expect(service.findOne).toHaveBeenCalledWith(mockUserId, mockTag.id);
      expect(repository.remove).toHaveBeenCalledWith(mockTag);
    });

    it('should throw NotFoundException if tag not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(
        service.remove(mockUserId, 'non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('countByUser', () => {
    it('should return total count of user tags', async () => {
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