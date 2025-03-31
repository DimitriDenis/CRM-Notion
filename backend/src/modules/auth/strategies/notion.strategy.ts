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
   

    if (!tokenResponse.ok) {
      return callback(new Error(`Token exchange failed: ${JSON.stringify(responseData)}`));
    }

        if (!tokenResponse.ok) {
          return callback(new Error(`Token exchange failed: ${responseData.message || tokenResponse.status}`));
        }

        const { access_token, bot_id, workspace_id, owner } = responseData;
        return callback(null, access_token, null, { bot_id, workspace_id, owner });

      } catch (error) {
        
        return callback(error);
      }
    };
  }

  async validate(req: any, accessToken: string, refreshToken: string): Promise<any> {
    try {
     
      const response = await fetch('https://api.notion.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Notion-Version': '2022-06-28',
        },
      });
  
      const userData = await response.json();
     
  
      // Si c'est un bot, regardons qui est le propriétaire
      if (userData.type === 'bot') {
        
      }
  
      // Récupérons les informations essentielles
      const userInfo = {
        id: userData.bot?.owner?.user?.id || userData.id,
        email: userData.bot?.owner?.user?.person?.email || userData.email,
        name: userData.bot?.owner?.user?.name || userData.name,
      };
  
      
  
      // Créer ou mettre à jour l'utilisateur
      const validatedUser = await this.authService.validateNotionUser({
        ...userInfo,
        accessToken,
        workspaceId: userData.bot?.workspace_name || userData.workspace_id,
      });
  
      return validatedUser;
    } catch (error) {
      
      return null;
    }
  }

  private async getNotionUserInfo(token: string) {
    
    try {
      const response = await fetch('https://api.notion.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
        },
      });
  
     
  
      const data = await response.json();
      
  
      if (!response.ok) {
        throw new Error(`Notion API error: ${response.status} - ${data.message}`);
      }
  
      return data;
    } catch (error) {
      
      throw error;
    }
  }
}