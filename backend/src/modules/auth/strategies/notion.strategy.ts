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

    console.log('=== Notion OAuth Config ===', {
      clientID: configService.get('NOTION_OAUTH_CLIENT_ID'),
      redirectUri: configService.get('NOTION_OAUTH_REDIRECT_URI'),
      hasSecret: !!configService.get('NOTION_OAUTH_CLIENT_SECRET')
    });
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
      passReqToCallback: true
    });

    

    // Override de la méthode d'échange de token
    this._oauth2.getOAuthAccessToken = async (code, params, callback) => {
      try {
        console.log('=== Detailed OAuth Exchange ===');
        const authString = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
    
        console.log('Request details:', {
          url: 'https://api.notion.com/v1/oauth/token',
          code,
          redirect_uri: callbackURL
        });


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
    console.log('Detailed Token Response:', {
      status: tokenResponse.status,
      data: responseData
    });

    if (!tokenResponse.ok) {
      return callback(new Error(`Token exchange failed: ${JSON.stringify(responseData)}`));
    }

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

  async validate(req: any, accessToken: string, refreshToken: string): Promise<any> {
    try {
      console.log('=== Starting Validation ===');
      const response = await fetch('https://api.notion.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Notion-Version': '2022-06-28',
        },
      });
  
      const userData = await response.json();
      console.log('Raw Notion User Data:', JSON.stringify(userData, null, 2));
  
      // Si c'est un bot, regardons qui est le propriétaire
      if (userData.type === 'bot') {
        console.log('Bot Owner:', userData.bot?.owner);
      }
  
      // Récupérons les informations essentielles
      const userInfo = {
        id: userData.bot?.owner?.user?.id || userData.id,
        email: userData.bot?.owner?.user?.person?.email || userData.email,
        name: userData.bot?.owner?.user?.name || userData.name,
      };
  
      console.log('Extracted User Info:', userInfo);
  
      // Créer ou mettre à jour l'utilisateur
      const validatedUser = await this.authService.validateNotionUser({
        ...userInfo,
        accessToken,
        workspaceId: userData.bot?.workspace_name || userData.workspace_id,
      });
  
      return validatedUser;
    } catch (error) {
      console.error('Validation Error:', error);
      return null;
    }
  }

  private async getNotionUserInfo(token: string) {
    console.log('=== Getting Notion User Info ===');
    try {
      const response = await fetch('https://api.notion.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
        },
      });
  
      console.log('Notion API Response:', {
        status: response.status,
        ok: response.ok
      });
  
      const data = await response.json();
      console.log('Notion API Data:', data);
  
      if (!response.ok) {
        throw new Error(`Notion API error: ${response.status} - ${data.message}`);
      }
  
      return data;
    } catch (error) {
      console.error('getNotionUserInfo Error:', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
}