// src/modules/tags/tags.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { FindTagsDto } from './dto/find-tags.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(userId: string, createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create({
      ...createTagDto,
      userId,
    });

    return this.tagRepository.save(tag);
  }

  async findAll(userId: string, options: FindTagsDto = {}): Promise<{ items: Tag[]; total: number }> {
    const { skip = 0, take = 10, search } = options;

    const queryBuilder = this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.userId = :userId', { userId });

    if (search) {
      queryBuilder.andWhere('tag.name ILIKE :search', { search: `%${search}%` });
    }

    const [items, total] = await queryBuilder
      .orderBy('tag.name', 'ASC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return { items, total };
  }

  async findOne(userId: string, id: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id, userId },
    });

    if (!tag) {
      throw new NotFoundException(`Tag #${id} not found`);
    }

    return tag;
  }

  async update(userId: string, id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(userId, id);
    Object.assign(tag, updateTagDto);
    return this.tagRepository.save(tag);
  }

  async remove(userId: string, id: string): Promise<void> {
    const tag = await this.findOne(userId, id);
    await this.tagRepository.remove(tag);
  }

  async countByUser(userId: string): Promise<number> {
    return this.tagRepository.count({
      where: { userId },
    });
  }
}