// src/modules/auth/strategies/notion.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class NotionStrategy extends PassportStrategy(Strategy, 'notion') {
  private _oauth2: any;
  authenticate: (req: any, options?: any) => any;
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
    });

    // Au début du constructeur après super()
    this.authenticate = (req: any, options?: any) => {
      console.log('=== OAuth Authentication Request ===', {
        clientID: this._oauth2._clientId,
        redirectUri: this._oauth2._redirectUri,
        authorizeUrl: this._oauth2._authorizeUrl,
        options
      });
      return super.authenticate(req, options);
    };

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

  async validate(accessToken: string): Promise<any> {
    try {
      console.log('=== Validating Token ===');
      console.log('Access Token:', accessToken.substring(0, 10) + '...');
      
      const notionUser = await this.getNotionUserInfo(accessToken);
      console.log('=== Notion User Info ===', {
        bot_id: notionUser.bot_id,
        user: notionUser.owner?.user,
        workspace: notionUser.workspace_id
      });
      
      const validatedUser = await this.authService.validateNotionUser({
        id: notionUser.owner?.user?.id,
        email: notionUser.owner?.user?.email,
        name: notionUser.owner?.user?.name,
        accessToken,
        workspaceId: notionUser.workspace_id,
      });
      
      console.log('=== Validated User ===', {
        id: validatedUser.id,
        email: validatedUser.email,
        name: validatedUser.name
      });
  
      return validatedUser;
    } catch (error) {
      console.error('=== Validation Error ===', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
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