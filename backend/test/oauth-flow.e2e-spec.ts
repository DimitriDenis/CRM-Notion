// backend/test/oauth-flow.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { NotionService } from '../src/modules/notion/notion.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/modules/users/user.entity';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '@nestjs/passport';

describe('OAuth Flow (e2e)', () => {
  let app: INestApplication;
  let notionService: NotionService;
  let jwtService: JwtService;

  const mockNotionCode = 'test-oauth-code';
  const mockNotionAccessToken = 'test-access-token';
  const mockNotionUserData = {
    bot_id: 'test-bot-id',
    owner: {
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
      },
      workspace: {
        id: 'test-workspace-id',
        name: 'Test Workspace',
      },
    },
  };

  const mockUserRepository = {
    findOne: jest.fn().mockResolvedValue({
      id: 'test-user-id',
      email: 'test@example.com',
      notionAccessToken: mockNotionAccessToken,
    }),
    save: jest.fn().mockImplementation(user => Promise.resolve({ ...user, id: 'test-user-id' })),
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(NotionService)
      .useValue({
        getUserInfo: jest.fn().mockResolvedValue(mockNotionUserData),
        verifyAccessToken: jest.fn().mockResolvedValue(true),
        exchangeCodeForAccessToken: jest.fn().mockResolvedValue({
          access_token: mockNotionAccessToken,
          workspace_id: mockNotionUserData.owner.workspace.id,
        }),
      })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUserRepository)
      .overrideGuard(AuthGuard('notion'))
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          const res = context.switchToHttp().getResponse();
          
          // Si c'est la route initiale OAuth, rediriger vers Notion
          if (req.url === '/auth/notion') {
            res.redirect('https://api.notion.com/v1/oauth/authorize');
            return false;  // Arrêter l'exécution ici
          }
  
          // Pour le callback
          req.user = mockNotionUserData;
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    
    // Configuration des variables d'environnement
    const configService = app.get(ConfigService);
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      const config = {
        'NOTION_OAUTH_CLIENT_ID': 'test-client-id',
        'NOTION_OAUTH_CLIENT_SECRET': 'test-client-secret',
        'NOTION_OAUTH_REDIRECT_URI': 'http://localhost:3000/api/auth/callback/notion',
        'FRONTEND_URL': 'http://localhost:3000',
        'JWT_SECRET': 'test-secret'
      };
      return config[key];
    });

    notionService = moduleFixture.get<NotionService>(NotionService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('OAuth Flow', () => {
    it('should handle the complete OAuth flow', async () => {
      // 1. Initiate OAuth
      const response = await request(app.getHttpServer())
        .get('/auth/notion')
        .expect(302)
        .catch(error => {
          console.error('OAuth initiation error:', error);
          throw error;
        });

      expect(response.header.location).toContain('api.notion.com');

      // 2. Handle OAuth callback
      const callbackResponse = await request(app.getHttpServer())
        .get(`/auth/notion/callback?code=${mockNotionCode}`)
        .expect(302)
        .catch(error => {
          console.error('Callback error:', error.response?.body);
          throw error;
        });

      expect(callbackResponse.header.location).toBeDefined();
      expect(callbackResponse.header.location).toContain('token=');

      // 3. Verify the access token works
      const token = callbackResponse.header.location.split('token=')[1];
      const userData = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .catch(error => {
          console.error('User data error:', error.response?.body);
          throw error;
        });

      expect(userData.body).toMatchObject({
        email: mockNotionUserData.owner.user.email,
      });
    });

    it('should handle OAuth errors gracefully', async () => {
        const frontendUrl = 'http://localhost:3000';

      const response = await request(app.getHttpServer())
        .get('/auth/notion/callback?error=access_denied')
        .expect(302)
        .catch(error => {
          console.error('OAuth error handling error:', error.response?.body);
          throw error;
        });

        expect(response.header.location).toBe(
            `${frontendUrl}/auth/error?message=Authentication%20failed`
          );
    });
  });
});