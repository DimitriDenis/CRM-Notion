// test/tags.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Tag } from '../src/modules/tags/tag.entity';
import { User } from '../src/modules/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserPlan } from '../src/modules/users/user.entity';

describe('Tags (e2e)', () => {
  let app: INestApplication;
  let tagRepository: Repository<Tag>;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let testUser: User;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    
    tagRepository = moduleFixture.get(getRepositoryToken(Tag));
    userRepository = moduleFixture.get(getRepositoryToken(User));
    jwtService = moduleFixture.get(JwtService);

    await app.init();

    // Créer un utilisateur de test
    testUser = await userRepository.save({
      email: 'test@example.com',
      name: 'Test User',
      notionUserId: 'test-notion-id',
      notionAccessToken: 'test-token',
      notionWorkspaceId: 'test-workspace',
      plan: UserPlan.FREE,
      isActive: true,
    });

    authToken = jwtService.sign({ sub: testUser.id });
  });

  afterAll(async () => {
    await tagRepository.delete({});
    await userRepository.delete({});
    await app.close();
  });

  describe('POST /tags', () => {
    it('should create a tag', () => {
      const createTagDto = {
        name: 'Important',
        color: '#FF0000',
      };

      return request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTagDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject({
            name: createTagDto.name,
            color: createTagDto.color,
            id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
    });

    it('should validate tag data', () => {
      const invalidTag = {
        name: '',
        color: 'invalid-color',
      };

      return request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTag)
        .expect(400)
        .expect((res) => {
            expect(Array.isArray(res.body.message)).toBe(true);
            expect(res.body.message).toEqual(
              expect.arrayContaining([
                expect.stringContaining('name should not be empty'),
                expect.stringContaining('color must be a hexadecimal color')
              ])
            );
        });
    });
  });

  describe('GET /tags', () => {
    let testTag: Tag;

    beforeEach(async () => {
      testTag = await tagRepository.save({
        name: 'Test Tag',
        color: '#0000FF',
        userId: testUser.id,
      });
    });

    it('should return paginated tags', () => {
      return request(app.getHttpServer())
        .get('/tags')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            items: expect.arrayContaining([
              expect.objectContaining({
                id: testTag.id,
                name: testTag.name,
              }),
            ]),
            total: expect.any(Number),
          });
        });
    });

    it('should support search by name', () => {
      return request(app.getHttpServer())
        .get('/tags')
        .query({ search: 'Test' })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.items).toContainEqual(
            expect.objectContaining({
              name: testTag.name,
            }),
          );
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('/tags')
        .query({ skip: 0, take: 5 })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.items.length).toBeLessThanOrEqual(5);
        });
    });
  });

  describe('GET /tags/:id', () => {
    let testTag: Tag;

    beforeEach(async () => {
      testTag = await tagRepository.save({
        name: 'Test Tag',
        color: '#0000FF',
        userId: testUser.id,
      });
    });

    it('should return a tag by id', () => {
      return request(app.getHttpServer())
        .get(`/tags/${testTag.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            id: testTag.id,
            name: testTag.name,
            color: testTag.color,
          });
        });
    });

    it('should return 404 for non-existent tag', () => {

        const nonExistentId = '00000000-0000-4000-a000-000000000000';
      return request(app.getHttpServer())
        .get(`/tags/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /tags/:id', () => {
    let testTag: Tag;

    beforeEach(async () => {
      testTag = await tagRepository.save({
        name: 'Test Tag',
        color: '#0000FF',
        userId: testUser.id,
      });
    });

    it('should update a tag', () => {
      const updateData = {
        name: 'Updated Tag',
        color: '#00FF00',
      };

      return request(app.getHttpServer())
        .put(`/tags/${testTag.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            id: testTag.id,
            ...updateData,
          });
        });
    });

    it('should validate update data', () => {
      const invalidData = {
        name: '',
        color: 'invalid-color',
      };

      return request(app.getHttpServer())
        .put(`/tags/${testTag.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);
    });
  });

  describe('DELETE /tags/:id', () => {
    let testTag: Tag;

    beforeEach(async () => {
      testTag = await tagRepository.save({
        name: 'Test Tag',
        color: '#0000FF',
        userId: testUser.id,
      });
    });

    it('should delete a tag', async () => {
      await request(app.getHttpServer())
        .delete(`/tags/${testTag.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Vérifier que le tag a bien été supprimé
      const deletedTag = await tagRepository.findOne({
        where: { id: testTag.id },
      });
      expect(deletedTag).toBeNull();
    });
  });
});