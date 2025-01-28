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
    const clientID = configService.get('NOTION_OAUTH_CLIENT_ID');
    const clientSecret = configService.get('NOTION_OAUTH_CLIENT_SECRET');
    const callbackURL = configService.get('NOTION_OAUTH_REDIRECT_URI');

    console.log('Notion Strategy initialization:', {
      clientID: clientID ? `${clientID.substring(0, 8)}...` : 'Non défini',
      clientSecret: clientSecret ? 'Défini' : 'Non défini',
      callbackURL,
    });

    super({
      authorizationURL: 'https://api.notion.com/v1/oauth/authorize',
      tokenURL: 'https://api.notion.com/v1/oauth/token',
      clientID,
      clientSecret,
      callbackURL,
      scope: [''],
      state: true
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    try {
      console.log('Validate method called:', {
        hasAccessToken: !!accessToken,
        accessTokenPreview: accessToken ? `${accessToken.substring(0, 8)}...` : 'No token',
        hasRefreshToken: !!refreshToken,
        profile: profile || 'No profile',
      });

      // Le profile Notion sera récupéré via un appel API séparé
      console.log('Attempting to fetch Notion user info...');
      const notionUser = await this.getNotionUserInfo(accessToken);
      console.log('Notion user info received:', {
        bot_id: notionUser.bot_id,
        workspace_id: notionUser.workspace_id,
        owner: {
          user: {
            email: notionUser.owner?.user?.email,
            name: notionUser.owner?.user?.name,
          }
        }
      });

      const validatedUser = await this.authService.validateNotionUser({
        id: notionUser.bot_id,
        email: notionUser.owner.user.email,
        name: notionUser.owner.user.name,
        accessToken,
        workspaceId: notionUser.workspace_id,
      });

      console.log('User validated successfully:', {
        id: validatedUser.id,
        email: validatedUser.email,
        name: validatedUser.name,
      });

      return validatedUser;
    } catch (error) {
      console.error('Error in validate method:', {
        message: error.message,
        stack: error.stack,
        type: error.name,
      });
      throw error;
    }
  }

  private async getNotionUserInfo(accessToken: string) {
    try {
      console.log('Fetching Notion user info with token preview:', accessToken.substring(0, 8));
      
      const response = await fetch('https://api.notion.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Notion-Version': '2022-06-28',
        },
      });

      console.log('Notion API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Notion API error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Failed to fetch Notion user info: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Notion API Response data received');
      return data;
    } catch (error) {
      console.error('Error fetching Notion user info:', {
        message: error.message,
        stack: error.stack,
        type: error.name
      });
      throw error;
    }
  }
}