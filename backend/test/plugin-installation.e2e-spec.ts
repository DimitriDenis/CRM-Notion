// backend/test/plugin-installation.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { NotionService } from '../src/modules/notion/notion.service';
import { User } from '../src/modules/users/user.entity';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

describe('Plugin Installation (e2e)', () => {
  let app: INestApplication;
  let notionService: NotionService;
  let jwtService: JwtService;

  const mockUser: Partial<User> = {
    id: 'test-user-id',
    email: 'test@example.com',
    notionUserId: 'test-notion-id',
    notionAccessToken: 'test-access-token',
    notionWorkspaceId: 'test-workspace-id'
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(NotionService)
      .useValue({
        verifyAccessToken: jest.fn().mockImplementation((token) => {
            // Retourne false pour les tokens invalides
            return token !== 'invalid-token';
          }),
        setupInitialDatabases: jest.fn().mockResolvedValue({
          success: true,
          databases: {
            contacts: 'contact-db-id',
            pipelines: 'pipeline-db-id',
            deals: 'deals-db-id',
          },
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    notionService = moduleFixture.get<NotionService>(NotionService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    
    // Créer un vrai token JWT
    const token = jwtService.sign({ sub: mockUser.id });
    mockUser.notionAccessToken = token;

    // Config global auth guard pour les tests
    app.useGlobalGuards({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          const authHeader = req.headers.authorization;
          const token = authHeader?.split(' ')[1];
          
          if (token === 'invalid-token') {
            throw new UnauthorizedException();
          }
          
          req.user = mockUser;
          return true;
        },
      });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Plugin Permissions', () => {
    it('should verify required permissions', async () => {
      const permissionsResponse = await request(app.getHttpServer())
        .get('/auth/notion/permissions')
        .set('Authorization', `Bearer ${mockUser.notionAccessToken}`)
        .expect(200);

      expect(permissionsResponse.body).toMatchObject({
        hasRequiredPermissions: true,
        permissions: {
          readContent: true,
          updateContent: true,
          insertContent: true,
        },
      });
    });

    it('should handle missing permissions', async () => {
      jest.spyOn(notionService, 'verifyAccessToken').mockResolvedValueOnce(false);

      await request(app.getHttpServer())
        .get('/auth/notion/permissions')
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);
    });
  });

  describe('Plugin Setup', () => {
    it('should setup initial databases', async () => {
      const setupResponse = await request(app.getHttpServer())
        .post('/auth/notion/setup')
        .set('Authorization', `Bearer ${mockUser.notionAccessToken}`)
        .expect(201);

      expect(setupResponse.body).toMatchObject({
        success: true,
        databases: {
          contacts: expect.any(String),
          pipelines: expect.any(String),
          deals: expect.any(String),
        },
      });
    });

    it('should handle setup errors gracefully', async () => {
      await request(app.getHttpServer())
        .post('/auth/notion/setup')
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);
    });
  });
});