// src/modules/auth/strategies/notion.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class NotionStrategy extends PassportStrategy(Strategy, 'notion') {
  private _oauth2: any;
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const clientID = configService.get('NOTION_OAUTH_CLIENT_ID');
    const clientSecret = configService.get('NOTION_OAUTH_CLIENT_SECRET');
    const callbackURL = configService.get('NOTION_OAUTH_REDIRECT_URI');

    console.log('=== Notion Strategy Configuration ===', {
      clientIDExists: !!clientID,
      clientSecretExists: !!clientSecret,
      callbackURL
    });

    super({
      authorizationURL: 'https://api.notion.com/v1/oauth/authorize',
      tokenURL: 'https://api.notion.com/v1/oauth/token',
      clientID,
      clientSecret,
      callbackURL,
      scope: [''],
      state: false,
    });

    // Override de la méthode d'échange de token
    this._oauth2.getOAuthAccessToken = async (code, params, callback) => {
      try {
        console.log('=== Exchanging OAuth Code ===', {
          code,
          params
        });

        // Préparation de l'authentification Basic
        const authString = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');

        const tokenResponse = await fetch('https://api.notion.com/v1/oauth/token', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
          },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            code,
            redirect_uri: callbackURL
          })
        });

        const responseData = await tokenResponse.json();
        console.log('Token Exchange Response:', {
          status: tokenResponse.status,
          success: tokenResponse.ok,
          hasAccessToken: !!responseData.access_token
        });

        if (!tokenResponse.ok) {
          return callback(new Error(`Token exchange failed: ${responseData.message || tokenResponse.status}`));
        }

        const { access_token, bot_id, workspace_id, owner } = responseData;
        return callback(null, access_token, null, { bot_id, workspace_id, owner });

      } catch (error) {
        console.error('Token Exchange Error:', {
          name: error.name,
          message: error.message
        });
        return callback(error);
      }
    };
  }

  async validate(accessToken: string): Promise<any> {
    try {
      console.log('=== Validating Token ===', {
        hasToken: !!accessToken,
        tokenPreview: accessToken ? `${accessToken.substring(0, 10)}...` : null
      });

      const notionUser = await this.getNotionUserInfo(accessToken);
      
      const validatedUser = await this.authService.validateNotionUser({
        id: notionUser.bot_id,
        email: notionUser.owner?.user?.email,
        name: notionUser.owner?.user?.name,
        accessToken,
        workspaceId: notionUser.workspace_id,
      });

      return validatedUser;
    } catch (error) {
      console.error('Validation Error:', error);
      throw error;
    }
  }

  private async getNotionUserInfo(token: string) {
    const response = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!response.ok) {
      console.error('Notion API Error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to fetch user info: ${response.status}`);
    }

    return response.json();
  }
}