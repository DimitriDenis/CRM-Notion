// src/modules/notion/notion.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotionService {
  constructor(private configService: ConfigService) {}

  async getUserInfo(accessToken: string) {
    const response = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Notion user info');
    }

    return response.json();
  }
}