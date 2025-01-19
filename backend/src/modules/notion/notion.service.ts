// src/modules/notion/notion.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NOTION_API_VERSION } from './constants/database-schemas';

@Injectable()
export class NotionService {
  private readonly logger = new Logger(NotionService.name);
  private readonly baseUrl = 'https://api.notion.com/v1';

  constructor(private configService: ConfigService) {}

  private async notionRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Notion-Version': NOTION_API_VERSION,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      this.logger.error(`Notion API Error: ${response.status} - ${response.statusText}`);
      throw new BadRequestException('Error communicating with Notion');
    }

    return response.json();
  }

  async getUserInfo(accessToken: string) {
    return this.notionRequest('/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  async createDatabase(accessToken: string, workspaceId: string, title: string, schema: any) {
    return this.notionRequest('/databases', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        parent: { page_id: workspaceId },
        title: [{ text: { content: title } }],
        properties: schema,
      }),
    });
  }

  async queryDatabase(accessToken: string, databaseId: string, filter?: any) {
    return this.notionRequest(`/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ filter }),
    });
  }

  async updatePage(accessToken: string, pageId: string, properties: any) {
    return this.notionRequest(`/pages/${pageId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ properties }),
    });
  }

  async searchWorkspaces(accessToken: string) {
    return this.notionRequest('/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        filter: {
          property: 'object',
          value: 'workspace',
        },
      }),
    });
  }

  async verifyAccessToken(accessToken: string): Promise<boolean> {
    try {
      await this.getUserInfo(accessToken);
      return true;
    } catch (error) {
      this.logger.error('Token verification failed:', error);
      return false;
    }
  }

  async createPage(accessToken: string, databaseId: string, properties: any) {
    return this.notionRequest('/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties,
      }),
    });
  }
  
  async getPage(accessToken: string, pageId: string) {
    return this.notionRequest(`/pages/${pageId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }
}