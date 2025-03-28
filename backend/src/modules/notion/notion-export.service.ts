// src/modules/notion/notion-export.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { UsersService } from '../users/users.service';
import { ContactsService } from '../contacts/contacts.service';
import { DealsService } from '../deals/deals.service';
import { PipelinesService } from '../pipelines/pipelines.service';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class NotionExportService {
  constructor(
    private usersService: UsersService,
    private contactsService: ContactsService,
    private dealsService: DealsService,
    private pipelinesService: PipelinesService,
    private tagsService: TagsService,
  ) {}

  private getNotionClient(accessToken: string) {
    return new Client({ auth: accessToken });
  }

  async exportToNotion(userId: string, options: {
    entities: ('contacts' | 'deals' | 'pipelines' | 'tags')[],
    ids?: Record<string, string[]>, // ex: { contacts: ['id1', 'id2'], deals: ['id3'] }
    workspaceId?: string // Si null, utilise la page racine de l'utilisateur
  }) {
    // 1. Récupérer les infos de l'utilisateur et le token Notion
    const user = await this.usersService.findOne(userId);
    if (!user || !user.notionAccessToken) {
      throw new NotFoundException('Utilisateur non trouve ou Notion non connectee');
    }

    const notion = this.getNotionClient(user.notionAccessToken);
    let workspaceId = user.notionWorkspaceId;
    
    const isValidUUID = (id) => {
        return id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      };
      
      if (!isValidUUID(workspaceId)) {
        console.log('Invalid workspace ID detected:', workspaceId);
        
        try {
          // Rechercher un espace de travail valide
          console.log('Searching for valid workspaces...');
          const response = await notion.search({
            query: '',
            filter: {
              value: 'page',
              property: 'object'
            },
            page_size: 10
          });
          
          console.log('Search results:', response);
          
          // Trouver la première page valide pour l'utiliser comme parent
          if (response.results && response.results.length > 0) {
            // Rechercher la première page
            const pagesResponse = await notion.search({
              filter: {
                value: 'page',
                property: 'object'
              },
              page_size: 1
            });
            
            if (pagesResponse.results && pagesResponse.results.length > 0) {
              workspaceId = pagesResponse.results[0].id;
              console.log('Found valid page ID:', workspaceId);
            } else {
              throw new Error('Aucune page valide trouvée dans l espace de travail');
            }
          } else {
            throw new Error('Aucun espace de travail valide trouvé');
          }
        } catch (error) {
          console.error('Error finding valid workspace/page:', error);
          throw new NotFoundException('Impossible de trouver une page Notion valide à utiliser comme page parent. Veuillez d abord créer une page dans Notion.');
        }
      }
      
      if (!workspaceId) {
        throw new NotFoundException('No valid Notion workspace or page found');
      }
    

    // 2. Créer une page principale pour l'export
    const mainPage = await notion.pages.create({
      parent: { page_id: workspaceId },
      properties: {
        title: [{
          type: 'text',
          text: { content: `Export CRM - ${new Date().toLocaleString()}` }
        }]
      },
      children: [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'CRM Data Export' } }]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ 
              type: 'text', 
              text: { content: 'Cette page contient les données exportées depuis votre CRM.' } 
            }]
          }
        }
      ]
    });

    const results = {
      page_id: mainPage.id,
      databases: {} as Record<string, string>
    };

    // 3. Exporter chaque entité demandée
    for (const entity of options.entities) {
      switch(entity) {
        case 'contacts':
          const contactsDb = await this.exportContacts(
            notion, 
            mainPage.id, 
            userId, 
            options.ids?.contacts
          );
          results.databases.contacts = contactsDb;
          break;
        case 'deals':
          const dealsDb = await this.exportDeals(
            notion, 
            mainPage.id, 
            userId, 
            options.ids?.deals
          );
          results.databases.deals = dealsDb;
          break;
        case 'pipelines':
          const pipelinesDb = await this.exportPipelines(
            notion, 
            mainPage.id, 
            userId, 
            options.ids?.pipelines
          );
          results.databases.pipelines = pipelinesDb;
          break;
        case 'tags':
          const tagsDb = await this.exportTags(
            notion, 
            mainPage.id, 
            userId, 
            options.ids?.tags
          );
          results.databases.tags = tagsDb;
          break;
      }
    }

    return results;
  }

  // Méthodes d'export spécifiques pour chaque entité
  private async exportContacts(
    notion: Client, 
    pageId: string, 
    userId: string, 
    contactIds?: string[]
  ) {
    // 1. Créer la base de données de contacts
    const database = await notion.databases.create({
      parent: { page_id: pageId },
      title: [{ type: 'text', text: { content: 'Contacts' } }],
      properties: {
        Name: { title: {} },
        Email: { email: {} },
        Phone: { phone_number: {} },
        Company: { rich_text: {} },
        'Created At': { date: {} },
        'Updated At': { date: {} },
        Tags: { multi_select: {} },
        Notes: { rich_text: {} },
        'CRM ID': { rich_text: {} }, // Pour référence
      }
    });

    // 2. Récupérer les contacts
    const contactsData = contactIds 
      ? await Promise.all(contactIds.map(id => this.contactsService.findOne(userId, id)))
      : (await this.contactsService.findAll(userId, { take: 1000 })).items;

    // 3. Insérer les contacts dans la base de données
    for (const contact of contactsData) {
      await notion.pages.create({
        parent: { database_id: database.id },
        properties: {
          Name: { 
            title: [{ text: { content: `${contact.firstName} ${contact.lastName}` } }] 
          },
          Email: { email: contact.email || '' },
          Phone: { phone_number: contact.phone || '' },
          Company: { 
            rich_text: [{ text: { content: contact.company || '' } }] 
          },
          'Created At': { 
            date: { start: contact.createdAt.toISOString() } 
          },
          'Updated At': { 
            date: { start: contact.updatedAt.toISOString() } 
          },
          Tags: { 
            multi_select: contact.tags?.map(tag => ({ name: tag.name })) || [] 
          },
          Notes: { 
            rich_text: [{ text: { content: contact.notes || '' } }] 
          },
          'CRM ID': { 
            rich_text: [{ text: { content: contact.id } }] 
          }
        }
      });
    }

    return database.id;
  }

  private async exportDeals(
    notion: Client, 
    pageId: string, 
    userId: string, 
    dealIds?: string[]
  ) {
    // 1. Créer la base de données des deals
    const database = await notion.databases.create({
      parent: { page_id: pageId },
      title: [{ type: 'text', text: { content: 'Deals' } }],
      properties: {
        Name: { title: {} },
        Value: { number: { format: 'euro' } },
        Status: { 
          select: {
            options: [
              { name: 'active', color: 'blue' },
              { name: 'won', color: 'green' },
              { name: 'lost', color: 'red' }
            ]
          } 
        },
        Pipeline: { rich_text: {} },
        Stage: { rich_text: {} },
        'Expected Close Date': { date: {} },
        'Created At': { date: {} },
        'Updated At': { date: {} },
        Notes: { rich_text: {} },
        'CRM ID': { rich_text: {} }
      }
    });

    // 2. Récupérer les deals
    const dealsData = dealIds 
      ? await Promise.all(dealIds.map(id => this.dealsService.findOne(userId, id)))
      : (await this.dealsService.findAll(userId, { take: 1000 })).items;

      console.log('Premier deal exemple:', JSON.stringify(dealsData[0]));

    // 3. Insérer les deals dans la base de données
  for (const deal of dealsData) {
    try {
      // Récupérer les informations liées si nécessaire
      const pipeline = deal.pipeline 
        ? deal.pipeline 
        : deal.pipelineId 
          ? await this.pipelinesService.findOne(userId, deal.pipelineId)
          : null;
      
      const stageName = pipeline?.stages?.find(s => s.id === deal.stageId)?.name || 'Unknown';
      
      // Convertir la valeur en nombre
      const numericValue = typeof deal.value === 'string' 
        ? parseFloat(deal.value) 
        : (typeof deal.value === 'number' ? deal.value : 0);
      
      // Formater correctement la date de clôture prévue
      let expectedCloseDateProperty = null;
      if (deal.expectedCloseDate) {
        // Assurer que la date est au format ISO
        let dateString;
        const expDateStr = String(deal.expectedCloseDate);
        
        // Si c'est une chaîne simple comme "2025-03-19", la convertir au format ISO
        if (typeof deal.expectedCloseDate === 'string' && !expDateStr.includes('T')) {
          dateString = `${deal.expectedCloseDate}T00:00:00.000Z`;
        } else if (typeof deal.expectedCloseDate === 'string') {
          // Déjà au format ISO
          dateString = deal.expectedCloseDate;
        } else if (deal.expectedCloseDate instanceof Date) {
          dateString = deal.expectedCloseDate.toISOString();
        } else {
          // Essayer de créer une date
          const date = new Date(deal.expectedCloseDate);
          dateString = isNaN(date.getTime()) ? null : date.toISOString();
        }
        
        if (dateString) {
          expectedCloseDateProperty = { date: { start: dateString } };
        }
      }
      
      await notion.pages.create({
        parent: { database_id: database.id },
        properties: {
          Name: { 
            title: [{ text: { content: deal.name || 'Sans nom' } }] 
          },
          Value: { number: numericValue }, // Utiliser la valeur numérique
          Status: { select: { name: deal.status || 'active' } },
          Pipeline: { 
            rich_text: [{ text: { content: pipeline?.name || 'N/A' } }] 
          },
          Stage: { 
            rich_text: [{ text: { content: stageName } }] 
          },
          'Expected Close Date': expectedCloseDateProperty, // Utiliser la propriété formatée
          'Created At': { 
            date: { start: new Date(deal.createdAt).toISOString() } 
          },
          'Updated At': { 
            date: { start: new Date(deal.updatedAt).toISOString() } 
          },
          'CRM ID': { 
            rich_text: [{ text: { content: deal.id } }] 
          },
        }
      });
    } catch (error) {
      console.error(`Error exporting deal ${deal.id}:`, error);
      // Continue with next deal
    }
  }

  return database.id;
}

  private async exportPipelines(
    notion: Client, 
    pageId: string, 
    userId: string, 
    pipelineIds?: string[]
  ) {
    // Implémentation similaire à exportContacts et exportDeals
    const database = await notion.databases.create({
      parent: { page_id: pageId },
      title: [{ type: 'text', text: { content: 'Pipelines' } }],
      properties: {
        Name: { title: {} },
        'Stages Count': { number: {} },
        'Created At': { date: {} },
        'Updated At': { date: {} },
        'CRM ID': { rich_text: {} }
      }
    });

    const pipelinesData = pipelineIds 
      ? await Promise.all(pipelineIds.map(id => this.pipelinesService.findOne(userId, id)))
      : (await this.pipelinesService.findAll(userId)).items;

    for (const pipeline of pipelinesData) {
      // Créer une page pour chaque pipeline
      const pipelinePage = await notion.pages.create({
        parent: { database_id: database.id },
        properties: {
          Name: { 
            title: [{ text: { content: pipeline.name } }] 
          },
          'Stages Count': { number: pipeline.stages?.length || 0 },
          'Created At': { 
            date: { start: pipeline.createdAt.toISOString() } 
          },
          'Updated At': { 
            date: { start: pipeline.updatedAt.toISOString() } 
          },
          'CRM ID': { 
            rich_text: [{ text: { content: pipeline.id } }] 
          }
        }
      });

      // Ajouter les détails des étapes comme des blocs de contenu
      if (pipeline.stages?.length) {
        const stageBlocks: any[] = [
          {
            object: 'block',
            type: 'heading_3',
            heading_3: {
              rich_text: [{ 
                type: 'text', 
                text: { content: 'Pipeline Stages' } 
              }]
            }
          }
        ];

        for (const stage of pipeline.stages) {
          stageBlocks.push({
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [{ 
                type: 'text', 
                text: { content: stage.name } 
              }]
            }
          });
        }

        await notion.blocks.children.append({
          block_id: pipelinePage.id,
          children: stageBlocks
        });
      }
    }

    return database.id;
  }

  private async exportTags(
    notion: Client, 
    pageId: string, 
    userId: string, 
    tagIds?: string[]
  ) {
    // Similaire aux autres méthodes d'export
    const database = await notion.databases.create({
      parent: { page_id: pageId },
      title: [{ type: 'text', text: { content: 'Tags' } }],
      properties: {
        Name: { title: {} },
        Color: { rich_text: {} },
        'Created At': { date: {} },
        'Updated At': { date: {} },
        'CRM ID': { rich_text: {} }
      }
    });

    let tagsData;
  if (tagIds) {
    tagsData = await Promise.all(tagIds.map(id => this.tagsService.findOne(userId, id)));
  } else {
    const result = await this.tagsService.findAll(userId);
    // Vérifier si le résultat est un tableau ou un objet avec items et total
    tagsData = Array.isArray(result) ? result : result.items;
  }

    for (const tag of tagsData) {
      await notion.pages.create({
        parent: { database_id: database.id },
        properties: {
          Name: { 
            title: [{ text: { content: tag.name } }] 
          },
          Color: { 
            rich_text: [{ text: { content: tag.color || 'default' } }] 
          },
          'Created At': { 
            date: { start: tag.createdAt.toISOString() } 
          },
          'Updated At': { 
            date: { start: tag.updatedAt.toISOString() } 
          },
          'CRM ID': { 
            rich_text: [{ text: { content: tag.id } }] 
          }
        }
      });
    }

    return database.id;
  }
}