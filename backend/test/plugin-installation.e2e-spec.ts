// backend/test/plugin-installation.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { NotionService } from '../src/modules/notion/notion.service';
import { User } from '../src/modules/users/user.entity';
import { AppModule } from '../src/app.module';

describe('Plugin Installation (e2e)', () => {
  let app: INestApplication;
  let notionService: NotionService;

  const mockUser: Partial<User> = {
    id: 'test-user-id',
    email: 'test@example.com',
    notionUserId: 'test-notion-id',
    notionAccessToken: 'test-access-token',
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    notionService = moduleFixture.get<NotionService>(NotionService);

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
        .post('/notion/setup')
        .set('Authorization', `Bearer ${mockUser.notionAccessToken}`)
        .expect(200);

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
        .post('/notion/setup')
        .set('Authorization', `Bearer invalid-token`)
        .expect(401);
    });
  });
});