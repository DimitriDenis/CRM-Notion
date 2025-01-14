// src/modules/contacts/contacts.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { User } from '../users/user.entity';
import { Contact } from './contact.entity';

describe('ContactsController', () => {
  let controller: ContactsController;
  let service: ContactsService;

  const mockUser: Partial<User> = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        {
          provide: ContactsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            countByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
    service = module.get<ContactsService>(ContactsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a contact', async () => {
      const createContactDto: CreateContactDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const expectedResult = new Contact();
      Object.assign(expectedResult, {
        id: 'test-id',
        ...createContactDto,
        userId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],  // Ajout des propriétés obligatoires de l'entité Contact
        user: mockUser,  // Ajout de la relation user
        customFields: {},
        notionMetadata: null,
      });

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(mockUser as User, createContactDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(mockUser.id, createContactDto);
    });
  });

  // Ajoutez d'autres tests pour les méthodes findAll, findOne, update, remove, et getCount
});