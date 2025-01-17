// test/deals.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Deal } from '../src/modules/deals/deal.entity';
import { Pipeline } from '../src/modules/pipelines/pipeline.entity';
import { Contact } from '../src/modules/contacts/contact.entity';
import { User } from '../src/modules/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserPlan } from '../src/modules/users/user.entity';

describe('Deals (e2e)', () => {
  let app: INestApplication;
  let dealRepository: Repository<Deal>;
  let pipelineRepository: Repository<Pipeline>;
  let contactRepository: Repository<Contact>;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let testUser: User;
  let testPipeline: Pipeline;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    
    dealRepository = moduleFixture.get(getRepositoryToken(Deal));
    pipelineRepository = moduleFixture.get(getRepositoryToken(Pipeline));
    contactRepository = moduleFixture.get(getRepositoryToken(Contact));
    userRepository = moduleFixture.get(getRepositoryToken(User));
    jwtService = moduleFixture.get(JwtService);

    await app.init();

    // Création de l'utilisateur test
    testUser = await userRepository.save({
      email: 'test@example.com',
      name: 'Test User',
      notionUserId: 'test-notion-id',
      notionAccessToken: 'test-token',
      notionWorkspaceId: 'test-workspace',
      plan: UserPlan.FREE,
      isActive: true,
    });

    // Création du pipeline test
    testPipeline = await pipelineRepository.save({
      name: 'Test Pipeline',
      stages: [
        { id: 'stage-1', name: 'Lead', order: 1 },
        { id: 'stage-2', name: 'Negotiation', order: 2 },
        { id: 'stage-3', name: 'Closed', order: 3 }
      ],
      userId: testUser.id,
    });

    authToken = jwtService.sign({ sub: testUser.id });
  });

  afterAll(async () => {
    await dealRepository.delete({});
    await pipelineRepository.delete({});
    await contactRepository.delete({});
    await userRepository.delete({});
    await app.close();
  });

  describe('POST /deals', () => {
    it('should create a deal', () => {
      const createDealDto = {
        name: 'New Deal',
        value: 10000,
        pipelineId: testPipeline.id,
        stageId: 'stage-1',
      };

      return request(app.getHttpServer())
        .post('/deals')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDealDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject({
            name: createDealDto.name,
            value: createDealDto.value,
            pipelineId: testPipeline.id,
            stageId: 'stage-1',
            id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
    });

    it('should validate deal data', () => {
      const invalidDeal = {
        name: '',
        value: 'not-a-number',
        pipelineId: 'invalid-uuid',
      };

      return request(app.getHttpServer())
        .post('/deals')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDeal)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('name');
          expect(res.body.message).toContain('value');
          expect(res.body.message).toContain('pipelineId');
        });
    });
  });

  describe('GET /deals', () => {
    let testDeal: Deal;

    beforeEach(async () => {
      testDeal = await dealRepository.save({
        name: 'Test Deal',
        value: 5000,
        pipelineId: testPipeline.id,
        stageId: 'stage-1',
        userId: testUser.id,
      });
    });

    it('should return paginated deals', () => {
      return request(app.getHttpServer())
        .get('/deals')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            items: expect.arrayContaining([
              expect.objectContaining({
                id: testDeal.id,
                name: testDeal.name,
              }),
            ]),
            total: expect.any(Number),
          });
        });
    });

    it('should filter deals by pipeline', () => {
      return request(app.getHttpServer())
        .get(`/deals?pipelineId=${testPipeline.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.items).toContainEqual(
            expect.objectContaining({
              pipelineId: testPipeline.id,
            }),
          );
        });
    });

    it('should filter deals by stage', () => {
      return request(app.getHttpServer())
        .get(`/deals?stageId=stage-1`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.items).toContainEqual(
            expect.objectContaining({
              stageId: 'stage-1',
            }),
          );
        });
    });
  });

  describe('GET /deals/:id', () => {
    let testDeal: Deal;

    beforeEach(async () => {
      testDeal = await dealRepository.save({
        name: 'Test Deal',
        value: 5000,
        pipelineId: testPipeline.id,
        stageId: 'stage-1',
        userId: testUser.id,
      });
    });

    it('should return a deal by id', () => {
      return request(app.getHttpServer())
        .get(`/deals/${testDeal.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            id: testDeal.id,
            name: testDeal.name,
            value: testDeal.value,
            pipelineId: testPipeline.id,
          });
        });
    });

    it('should return 404 for non-existent deal', () => {
      return request(app.getHttpServer())
        .get('/deals/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /deals/:id', () => {
    let testDeal: Deal;

    beforeEach(async () => {
      testDeal = await dealRepository.save({
        name: 'Test Deal',
        value: 5000,
        pipelineId: testPipeline.id,
        stageId: 'stage-1',
        userId: testUser.id,
      });
    });

    it('should update a deal', () => {
      const updateData = {
        name: 'Updated Deal',
        value: 7500,
        stageId: 'stage-2',
      };

      return request(app.getHttpServer())
        .put(`/deals/${testDeal.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            id: testDeal.id,
            ...updateData,
            pipelineId: testPipeline.id,
          });
        });
    });
  });

  describe('DELETE /deals/:id', () => {
    let testDeal: Deal;

    beforeEach(async () => {
      testDeal = await dealRepository.save({
        name: 'Test Deal',
        value: 5000,
        pipelineId: testPipeline.id,
        stageId: 'stage-1',
        userId: testUser.id,
      });
    });

    it('should delete a deal', async () => {
      await request(app.getHttpServer())
        .delete(`/deals/${testDeal.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const deletedDeal = await dealRepository.findOne({
        where: { id: testDeal.id },
      });
      expect(deletedDeal).toBeNull();
    });
  });

  describe('GET /deals/stats/total-value', () => {
    beforeEach(async () => {
      await dealRepository.save([
        {
          name: 'Deal 1',
          value: 1000,
          pipelineId: testPipeline.id,
          stageId: 'stage-1',
          userId: testUser.id,
        },
        {
          name: 'Deal 2',
          value: 2000,
          pipelineId: testPipeline.id,
          stageId: 'stage-2',
          userId: testUser.id,
        },
      ]);
    });

    it('should return total value of all deals', () => {
      return request(app.getHttpServer())
        .get('/deals/stats/total-value')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            total: 3000,
          });
        });
    });
  });
});