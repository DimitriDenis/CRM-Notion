// src/modules/contacts/contacts.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Tag } from '../tags/tag.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(userId: string, createContactDto: CreateContactDto): Promise<Contact> {
    const { tagIds, ...contactData } = createContactDto;

    const contact = this.contactRepository.create({
      ...contactData,
      userId,
    });

    if (tagIds?.length) {
      const tags = await this.tagRepository.findBy({
        id: In(tagIds),
        userId,
      });

      if (tags.length !== tagIds.length) {
        throw new BadRequestException('Some tags were not found');
      }

      contact.tags = tags;
    }

    await this.contactRepository.save(contact);
    return this.findOne(userId, contact.id);
  }

  async findAll(userId: string, options: {
    skip?: number;
    take?: number;
    search?: string;
    tagIds?: string[];
  } = {}): Promise<{ items: Contact[]; total: number }> {
    const { skip = 0, take = 10, search, tagIds } = options;

    const queryBuilder = this.contactRepository
      .createQueryBuilder('contact')
      .leftJoinAndSelect('contact.tags', 'tag')
      .where('contact.userId = :userId', { userId });

    if (search) {
      queryBuilder.andWhere(
        '(contact.firstName ILIKE :search OR contact.lastName ILIKE :search OR contact.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (tagIds?.length) {
      queryBuilder.andWhere('tag.id IN (:...tagIds)', { tagIds });
    }

    const [items, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return { items, total };
  }

  async findOne(userId: string, id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id, userId },
      relations: ['tags'],
    });

    if (!contact) {
      throw new NotFoundException(`Contact #${id} not found`);
    }

    return contact;
  }

  async update(
    userId: string,
    id: string,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    const contact = await this.findOne(userId, id);
    const { tagIds, ...updateData } = updateContactDto;

    if (tagIds !== undefined) {
      const tags = await this.tagRepository.findBy({
        id: In(tagIds || []),
        userId,
      });

      if (tagIds?.length && tags.length !== tagIds.length) {
        throw new BadRequestException('Some tags were not found');
      }

      contact.tags = tags;
    }

    Object.assign(contact, updateData);
    await this.contactRepository.save(contact);

    return this.findOne(userId, id);
  }

  async remove(userId: string, id: string): Promise<void> {
    const contact = await this.findOne(userId, id);
    await this.contactRepository.remove(contact);
  }

  async countByUser(userId: string): Promise<number> {
    return this.contactRepository.count({
      where: { userId },
    });
  }
}