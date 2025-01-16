// test/pipelines.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Pipeline } from '../src/modules/pipelines/pipeline.entity';
import { User } from '../src/modules/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserPlan } from '../src/modules/users/user.entity';

describe('Pipelines (e2e)', () => {
  let app: INestApplication;
  let pipelineRepository: Repository<Pipeline>;
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
    
    pipelineRepository = moduleFixture.get(getRepositoryToken(Pipeline));
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
    await pipelineRepository.delete({});
    await userRepository.delete({});
    await app.close();
  });

  describe('POST /pipelines', () => {
    it('should create a pipeline with stages', () => {
      const createPipelineDto = {
        name: 'Sales Pipeline',
        stages: [
          { name: 'Lead', order: 1 },
          { name: 'Contact Made', order: 2 },
          { name: 'Negotiation', order: 3 },
        ],
      };

      return request(app.getHttpServer())
        .post('/pipelines')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createPipelineDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject({
            name: createPipelineDto.name,
            stages: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                name: 'Lead',
                order: 1,
              }),
            ]),
            id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
    });

    it('should validate pipeline data', () => {
      const invalidPipeline = {
        name: '',
        stages: [{ name: '', order: -1 }],
      };

      return request(app.getHttpServer())
        .post('/pipelines')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidPipeline)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('name');
          expect(res.body.message).toContain('stages');
        });
    });
  });

  describe('GET /pipelines', () => {
    let testPipeline: Pipeline;

    beforeEach(async () => {
      testPipeline = await pipelineRepository.save({
        name: 'Test Pipeline',
        stages: [
          { id: 'stage-1', name: 'Test Stage', order: 1 },
        ],
        userId: testUser.id,
      });
    });

    it('should return paginated pipelines', () => {
      return request(app.getHttpServer())
        .get('/pipelines')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            items: expect.arrayContaining([
              expect.objectContaining({
                id: testPipeline.id,
                name: testPipeline.name,
              }),
            ]),
            total: expect.any(Number),
          });
        });
    });

    it('should support pagination', () => {
      return request(app.getHttpServer())
        .get('/pipelines?skip=0&take=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.items.length).toBeLessThanOrEqual(5);
        });
    });
  });

  describe('GET /pipelines/:id', () => {
    let testPipeline: Pipeline;

    beforeEach(async () => {
      testPipeline = await pipelineRepository.save({
        name: 'Test Pipeline',
        stages: [
          { id: 'stage-1', name: 'Test Stage', order: 1 },
        ],
        userId: testUser.id,
      });
    });

    it('should return a pipeline by id', () => {
      return request(app.getHttpServer())
        .get(`/pipelines/${testPipeline.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            id: testPipeline.id,
            name: testPipeline.name,
            stages: expect.arrayContaining([
              expect.objectContaining({
                id: 'stage-1',
                name: 'Test Stage',
                order: 1,
              }),
            ]),
          });
        });
    });

    it('should return 404 for non-existent pipeline', () => {
      return request(app.getHttpServer())
        .get('/pipelines/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /pipelines/:id', () => {
    let testPipeline: Pipeline;

    beforeEach(async () => {
      testPipeline = await pipelineRepository.save({
        name: 'Test Pipeline',
        stages: [
          { id: 'stage-1', name: 'Test Stage', order: 1 },
        ],
        userId: testUser.id,
      });
    });

    it('should update a pipeline', () => {
      const updateData = {
        name: 'Updated Pipeline',
        stages: [
          { id: 'stage-1', name: 'Updated Stage', order: 1 },
          { name: 'New Stage', order: 2 },
        ],
      };

      return request(app.getHttpServer())
        .put(`/pipelines/${testPipeline.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            id: testPipeline.id,
            name: updateData.name,
            stages: expect.arrayContaining([
              expect.objectContaining({
                id: 'stage-1',
                name: 'Updated Stage',
                order: 1,
              }),
            ]),
          });
          expect(res.body.stages).toHaveLength(2);
        });
    });
  });

  describe('DELETE /pipelines/:id', () => {
    let testPipeline: Pipeline;

    beforeEach(async () => {
      testPipeline = await pipelineRepository.save({
        name: 'Test Pipeline',
        stages: [
          { id: 'stage-1', name: 'Test Stage', order: 1 },
        ],
        userId: testUser.id,
      });
    });

    it('should delete a pipeline', async () => {
      await request(app.getHttpServer())
        .delete(`/pipelines/${testPipeline.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Vérifier que le pipeline a bien été supprimé
      const deletedPipeline = await pipelineRepository.findOne({
        where: { id: testPipeline.id },
      });
      expect(deletedPipeline).toBeNull();
    });
  });
});