// src/modules/notion/contact-sync.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactSyncService } from './contact-sync.service';
import { NotionService } from './notion.service';
import { ContactsService } from '../contacts/contacts.service';
import { Contact } from '../contacts/contact.entity';
import { Logger } from '@nestjs/common';
import { Tag } from '../tags/tag.entity';

describe('ContactSyncService', () => {
  let service: ContactSyncService;
  let notionService: NotionService;
  let contactsService: ContactsService;
  let contactRepository: Repository<Contact>;


 

  const mockContact: Contact = {
    id: 'test-id',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    company: 'ACME Inc',
    notes: 'Test notes',
    tags: [
        Object.assign(new Tag(), {
          id: 'tag-1',
          name: 'Important',
          color: '#FF0000',
          userId: 'test-user-id',
          user: null,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ],
      user: null,  // Ajout de la propriété manquante
    customFields: null,
    userId: 'test-user-id',
    notionMetadata: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockNotionPage = {
    id: 'notion-page-id',
    properties: {
      Name: {
        title: [{ text: { content: 'John Doe' } }],
      },
      Email: {
        email: 'john@example.com',
      },
      Phone: {
        phone_number: '1234567890',
      },
      Company: {
        rich_text: [{ text: { content: 'ACME Inc' } }],
      },
      Notes: {
        rich_text: [{ text: { content: 'Test notes' } }],
      },
      Tags: {
        multi_select: [{ name: 'Important' }],
      },
      Status: {
        select: { name: 'Active' },
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactSyncService,
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
          provide: ContactsService,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Contact),
          useValue: {
            update: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ContactSyncService>(ContactSyncService);
    notionService = module.get<NotionService>(NotionService);
    contactsService = module.get<ContactsService>(ContactsService);
    contactRepository = module.get<Repository<Contact>>(getRepositoryToken(Contact));

    // Mock du Logger
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  describe('initializeContactDatabase', () => {
    const mockAccessToken = 'test-token';
    const mockWorkspaceId = 'workspace-id';
    const mockDatabaseId = 'database-id';

    it('should create a new Notion database successfully', async () => {
      const mockDatabase = { id: mockDatabaseId };
      jest.spyOn(notionService, 'createDatabase').mockResolvedValue(mockDatabase);
      jest.spyOn(contactRepository, 'update').mockResolvedValue(undefined);

      const result = await service.initializeContactDatabase(
        mockContact.userId,
        mockAccessToken,
        mockWorkspaceId,
      );

      expect(notionService.createDatabase).toHaveBeenCalledWith(
        mockAccessToken,
        mockWorkspaceId,
        'CRM Contacts',
        expect.any(Object),
      );
      expect(contactRepository.update).toHaveBeenCalledWith(
        { userId: mockContact.userId },
        { notionMetadata: { databaseId: mockDatabaseId, lastSync: expect.any(Date) } },
      );
      expect(result).toEqual(mockDatabase);
    });

    it('should handle database creation errors', async () => {
      jest.spyOn(notionService, 'createDatabase').mockRejectedValue(new Error('API Error'));

      await expect(
        service.initializeContactDatabase(mockContact.userId, mockAccessToken, mockWorkspaceId),
      ).rejects.toThrow('API Error');
    });
  });

  describe('syncContactToNotion', () => {
    const mockAccessToken = 'test-token';
    const mockDatabaseId = 'database-id';

    it('should create a new page for contact without Notion metadata', async () => {
      jest.spyOn(contactsService, 'findOne').mockResolvedValue(mockContact);
      jest.spyOn(notionService, 'createPage').mockResolvedValue({ id: 'new-page-id' });
      jest.spyOn(contactRepository, 'update').mockResolvedValue(undefined);

      await service.syncContactToNotion(
        mockContact.userId,
        mockContact.id,
        mockAccessToken,
        mockDatabaseId,
      );

      expect(notionService.createPage).toHaveBeenCalled();
      expect(contactRepository.update).toHaveBeenCalledWith(
        { id: mockContact.id },
        {
          notionMetadata: {
            pageId: 'new-page-id',
            lastSync: expect.any(Date),
          },
        },
      );
    });

    it('should update existing Notion page for contact with metadata', async () => {
      const contactWithMetadata = {
        ...mockContact,
        notionMetadata: { pageId: 'existing-page-id', lastSync: new Date() },
      };
      jest.spyOn(contactsService, 'findOne').mockResolvedValue(contactWithMetadata);
      jest.spyOn(notionService, 'updatePage').mockResolvedValue({ id: 'existing-page-id' });

      await service.syncContactToNotion(
        contactWithMetadata.userId,
        contactWithMetadata.id,
        mockAccessToken,
        mockDatabaseId,
      );

      expect(notionService.updatePage).toHaveBeenCalledWith(
        mockAccessToken,
        'existing-page-id',
        expect.any(Object),
      );
    });

    it('should handle sync errors', async () => {
      jest.spyOn(contactsService, 'findOne').mockRejectedValue(new Error('Not found'));

      await expect(
        service.syncContactToNotion(mockContact.userId, mockContact.id, mockAccessToken, mockDatabaseId),
      ).rejects.toThrow();
    });
  });

  describe('syncContactFromNotion', () => {
    const mockAccessToken = 'test-token';

    it('should sync contact data from Notion successfully', async () => {
      const contactWithMetadata = {
        ...mockContact,
        notionMetadata: { pageId: 'notion-page-id', lastSync: new Date() },
      };
      
      jest.spyOn(contactsService, 'findOne')
        .mockResolvedValueOnce(contactWithMetadata)
        .mockResolvedValueOnce(contactWithMetadata);
      jest.spyOn(notionService, 'getPage').mockResolvedValue(mockNotionPage);
      jest.spyOn(contactRepository, 'update').mockResolvedValue(undefined);

      const result = await service.syncContactFromNotion(
        contactWithMetadata.userId,
        contactWithMetadata.id,
        mockAccessToken,
      );

      expect(notionService.getPage).toHaveBeenCalledWith(
        mockAccessToken,
        'notion-page-id',
      );
      expect(contactRepository.update).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should handle contacts not linked to Notion', async () => {
      jest.spyOn(contactsService, 'findOne').mockResolvedValue(mockContact);

      await expect(
        service.syncContactFromNotion(mockContact.userId, mockContact.id, mockAccessToken),
      ).rejects.toThrow('Contact not linked to Notion');
    });

    it('should handle Notion API errors', async () => {
      const contactWithMetadata = {
        ...mockContact,
        notionMetadata: { pageId: 'notion-page-id', lastSync: new Date() },
      };
      
      jest.spyOn(contactsService, 'findOne').mockResolvedValue(contactWithMetadata);
      jest.spyOn(notionService, 'getPage').mockRejectedValue(new Error('API Error'));

      await expect(
        service.syncContactFromNotion(mockContact.userId, mockContact.id, mockAccessToken),
      ).rejects.toThrow();
    });
  });

  describe('syncAllContacts', () => {
    const mockAccessToken = 'test-token';
    const mockDatabaseId = 'database-id';

    it('should sync all contacts successfully', async () => {
      jest.spyOn(contactsService, 'findAll').mockResolvedValue({
        items: [mockContact],
        total: 1,
      });
      jest.spyOn(service, 'syncContactToNotion').mockResolvedValue({ id: 'notion-page-id' });

      const result = await service.syncAllContacts(
        mockContact.userId,
        mockAccessToken,
        mockDatabaseId,
      );

      expect(result).toHaveLength(1);
      expect(service.syncContactToNotion).toHaveBeenCalled();
    });

    it('should handle errors during bulk sync', async () => {
      jest.spyOn(contactsService, 'findAll').mockResolvedValue({
        items: [mockContact],
        total: 1,
      });
      jest.spyOn(service, 'syncContactToNotion').mockRejectedValue(new Error('Sync failed'));

      await expect(
        service.syncAllContacts(mockContact.userId, mockAccessToken, mockDatabaseId),
      ).rejects.toThrow();
    });
  });

  describe('data conversion', () => {
    it('should correctly convert contact to Notion properties', async () => {
      const properties = await service['convertToNotionProperties'](mockContact);
      
      expect(properties).toMatchObject({
        Name: {
          title: [{ text: { content: 'John Doe' } }],
        },
        Email: {
          email: 'john@example.com',
        },
        Phone: {
          phone_number: '1234567890',
        },
      });
    });

    it('should correctly convert Notion properties to contact data', () => {
      const contactData = service['convertFromNotionProperties'](mockNotionPage.properties);
      
      expect(contactData).toMatchObject({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
      });
    });

    it('should handle missing properties gracefully', () => {
      const incompleteProperties = {
        Name: { title: [] },
        Email: { email: null },
        Phone: null,  
        Company: null, 
        Notes: null,  
        Tags: null,   
        Status: null  
      };

      const contactData = service['convertFromNotionProperties'](incompleteProperties);
      
      expect(contactData).toMatchObject({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        notes: ''
      });
    });
  });
});