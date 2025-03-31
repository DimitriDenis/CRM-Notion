// src/modules/contacts/contacts.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactsService } from './contacts.service';
import { Contact } from './contact.entity';
import { Tag } from '../tags/tag.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ContactsService', () => {
  let service: ContactsService;
  let contactRepository: Repository<Contact>;
  let tagRepository: Repository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: getRepositoryToken(Contact),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Tag),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
    contactRepository = module.get<Repository<Contact>>(getRepositoryToken(Contact));
    tagRepository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a contact successfully', async () => {
      const createContactDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const savedContact = new Contact();
      Object.assign(savedContact, {
        id: '123',
        ...createContactDto,
        userId: 'user123',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [], 
      });

      jest.spyOn(contactRepository, 'create').mockReturnValue(savedContact);
      jest.spyOn(contactRepository, 'save').mockResolvedValue(savedContact);
      jest.spyOn(service, 'findOne').mockResolvedValue(savedContact);

      const result = await service.create('user123', createContactDto);
      expect(result).toEqual(savedContact);
    });
  });

  
});