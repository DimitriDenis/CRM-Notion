// src/modules/notion/contact-sync.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { NotionService } from './notion.service';
import { ContactsService } from '../contacts/contacts.service';
import { CONTACT_DATABASE_SCHEMA } from './constants/database-schemas';
import { Contact } from '../contacts/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContactSyncService {
  private readonly logger = new Logger(ContactSyncService.name);

  constructor(
    private readonly notionService: NotionService,
    private readonly contactsService: ContactsService,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  private convertToNotionProperties(contact: Contact) {
    return {
      Name: {
        title: [
          {
            text: {
              content: `${contact.firstName} ${contact.lastName}`,
            },
          },
        ],
      },
      Email: {
        email: contact.email,
      },
      Phone: {
        phone_number: contact.phone || '',
      },
      Company: {
        rich_text: [
          {
            text: {
              content: contact.company || '',
            },
          },
        ],
      },
      Notes: {
        rich_text: [
          {
            text: {
              content: contact.notes || '',
            },
          },
        ],
      },
      Tags: {
        multi_select: contact.tags?.map(tag => ({
          name: tag.name,
        })) || [],
      },
      Status: {
        select: {
          name: 'Active',
        },
      },
    };
  }

  private convertFromNotionProperties(properties: any): Partial<Contact> {
    const fullName = properties.Name.title[0]?.text.content || '';
    const [firstName = '', lastName = ''] = fullName.split(' ');

    return {
      firstName,
      lastName,
      email: properties.Email.email || '',
      phone: properties.Phone?.phone_number || '',
      company: properties.Company?.rich_text[0]?.text.content || '',
      notes: properties.Notes?.rich_text[0]?.text.content || '',
      // Tags seront gérés séparément
    };
  }

  async initializeContactDatabase(userId: string, accessToken: string, workspaceId: string) {
    try {
      // Créer la base de données Notion pour les contacts
      const database = await this.notionService.createDatabase(
        accessToken,
        workspaceId,
        'CRM Contacts',
        CONTACT_DATABASE_SCHEMA,
      );

      // Sauvegarder l'ID de la base de données dans les métadonnées de l'utilisateur
      // Note: Il faudra ajouter un champ pour stocker cette information
      await this.contactRepository.update(
        { userId },
        { notionMetadata: { databaseId: database.id, lastSync: new Date() } }
      );

      return database;
    } catch (error) {
      this.logger.error('Failed to initialize contact database:', error);
      throw error;
    }
  }

  async syncContactToNotion(
    userId: string,
    contactId: string,
    accessToken: string,
    databaseId: string,
  ) {
    try {
      const contact = await this.contactsService.findOne(userId, contactId);
      const properties = this.convertToNotionProperties(contact);

      if (!contact.notionMetadata?.pageId) {
        // Création d'une nouvelle page
        const page = await this.notionService.createPage(
          accessToken,
          databaseId,
          properties,
        );

        // Mettre à jour les métadonnées du contact
        await this.contactRepository.update(
          { id: contactId },
          { 
            notionMetadata: { 
              pageId: page.id,
              lastSync: new Date(),
            }
          }
        );

        return page;
      } else {
        // Mise à jour d'une page existante
        return await this.notionService.updatePage(
          accessToken,
          contact.notionMetadata.pageId,
          properties,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to sync contact ${contactId} to Notion:`, error);
      throw error;
    }
  }

  async syncContactFromNotion(
    userId: string,
    contactId: string,
    accessToken: string,
  ) {
    try {
      const contact = await this.contactsService.findOne(userId, contactId);
      if (!contact.notionMetadata?.pageId) {
        throw new Error('Contact not linked to Notion');
      }

      const page = await this.notionService.getPage(
        accessToken,
        contact.notionMetadata.pageId,
      );

      const contactData = this.convertFromNotionProperties(page.properties);
      await this.contactRepository.update(
        { id: contactId },
        { 
          ...contactData,
          notionMetadata: {
            ...contact.notionMetadata,
            lastSync: new Date(),
          }
        }
      );

      return await this.contactsService.findOne(userId, contactId);
    } catch (error) {
      this.logger.error(`Failed to sync contact ${contactId} from Notion:`, error);
      throw error;
    }
  }

  async syncAllContacts(userId: string, accessToken: string, databaseId: string) {
    try {
      const contacts = await this.contactsService.findAll(userId, {});
      const results = await Promise.all(
        contacts.items.map(contact =>
          this.syncContactToNotion(userId, contact.id, accessToken, databaseId)
        )
      );

      return results;
    } catch (error) {
      this.logger.error('Failed to sync all contacts:', error);
      throw error;
    }
  }
}