// test/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/modules/auth/auth.service';
import { UsersService } from '../src/modules/users/users.service';
import { User, UserPlan } from '../src/modules/users/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get<AuthService>(AuthService);
    usersService = moduleFixture.get<UsersService>(UsersService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/notion (GET) should redirect to Notion OAuth', () => {
    return request(app.getHttpServer())
      .get('/auth/notion')
      .expect(302)
      .expect('Location', /^https:\/\/api\.notion\.com\/v1\/oauth\/authorize/);
  });

  it('should validate JWT token', async () => {
    // Créer un utilisateur de test
    const testUser = await usersService.createUser({
      email: 'test@example.com',
      name: 'Test User',
      notionUserId: 'test-notion-id',
      notionAccessToken: 'test-token',
      notionWorkspaceId: 'test-workspace',
      plan: UserPlan.FREE,
      isActive: true,
    });

    // Générer un token JWT
    const { access_token } = await authService.login(testUser);

    // Tester un endpoint protégé
    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(testUser.email);
        expect(res.body.plan).toBe(UserPlan.FREE);
      });
  });
});