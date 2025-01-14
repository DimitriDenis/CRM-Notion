// src/modules/auth/strategies/notion.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class NotionStrategy extends PassportStrategy(Strategy, 'notion') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      authorizationURL: 'https://api.notion.com/v1/oauth/authorize',
      tokenURL: 'https://api.notion.com/v1/oauth/token',
      clientID: configService.get('NOTION_OAUTH_CLIENT_ID'),
      clientSecret: configService.get('NOTION_OAUTH_CLIENT_SECRET'),
      callbackURL: configService.get('NOTION_OAUTH_REDIRECT_URI'),
      scope: [''],  // Notion ne nécessite pas de scope explicite pour l'OAuth de base
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    // Le profile Notion sera récupéré via un appel API séparé
    const notionUser = await this.getNotionUserInfo(accessToken);
    
    return this.authService.validateNotionUser({
      id: notionUser.bot_id,
      email: notionUser.owner.user.email,
      name: notionUser.owner.user.name,
      accessToken,
      workspaceId: notionUser.workspace_id,
    });
  }

  private async getNotionUserInfo(accessToken: string) {
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