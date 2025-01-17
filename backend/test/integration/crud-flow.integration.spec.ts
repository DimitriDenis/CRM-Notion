// test/integration/crud-flow.integration.spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/modules/users/user.entity';
import { Pipeline } from '../../src/modules/pipelines/pipeline.entity';
import { Contact } from '../../src/modules/contacts/contact.entity';
import { Deal } from '../../src/modules/deals/deal.entity';
import { Tag } from '../../src/modules/tags/tag.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

describe('CRM Flow (Integration)', () => {
  let app: INestApplication;
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

    userRepository = moduleFixture.get(getRepositoryToken(User));
    jwtService = moduleFixture.get(JwtService);

    await app.init();

    // Créer l'utilisateur test
    testUser = await userRepository.save({
      email: 'integration-test@example.com',
      name: 'Integration Test User',
      notionUserId: 'test-notion-id',
      notionAccessToken: 'test-token',
      notionWorkspaceId: 'test-workspace',
      isActive: true,
    });

    authToken = jwtService.sign({ sub: testUser.id });
  });

  afterAll(async () => {
    const dealRepository = app.get(getRepositoryToken(Deal));
    const contactRepository = app.get(getRepositoryToken(Contact));
    const tagRepository = app.get(getRepositoryToken(Tag));
    const pipelineRepository = app.get(getRepositoryToken(Pipeline));
  
    // Supprimer dans l'ordre pour respecter les contraintes de clé étrangère
    await dealRepository.delete({});
    await contactRepository.delete({});
    await tagRepository.delete({});
    await pipelineRepository.delete({});
    await userRepository.delete({});
    await app.close();
  });

  describe('Complete CRM Flow', () => {
    let pipelineId: string;
    let pipelineData: any;
    let contactId: string;
    let tagId: string;
    let dealId: string;

    it('should create a complete CRM workflow', async () => {
      // 1. Créer un tag
      const tagResponse = await request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Hot Lead',
          color: '#FF0000'
        })
        .expect(201);

      tagId = tagResponse.body.id;

      // 2. Créer un pipeline
      const pipelineResponse = await request(app.getHttpServer())
        .post('/pipelines')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Sales Pipeline',
          stages: [
            { name: 'Lead', order: 1 },
            { name: 'Contact Made', order: 2 },
            { name: 'Negotiation', order: 3 },
            { name: 'Closed Won', order: 4 }
          ]
        })
        .expect(201);

      pipelineId = pipelineResponse.body.id;
      pipelineData = pipelineResponse.body;

      // 3. Créer un contact
      const contactResponse = await request(app.getHttpServer())
        .post('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'John',
          lastName: 'Integration',
          email: 'john.integration@example.com',
          phone: '1234567890',
          tagIds: [tagId]
        })
        .expect(201);

      contactId = contactResponse.body.id;

      // 4. Créer un deal
      const dealResponse = await request(app.getHttpServer())
        .post('/deals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Big Integration Deal',
          value: 10000,
          pipelineId,
          stageId: pipelineResponse.body.stages[0].id,
          contactIds: [contactId]
        })
        .expect(201);

      dealId = dealResponse.body.id;

      // 5. Vérifier les relations
      const dealCheck = await request(app.getHttpServer())
        .get(`/deals/${dealId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(dealCheck.body.contacts).toContainEqual(
        expect.objectContaining({ id: contactId })
      );

      const contactCheck = await request(app.getHttpServer())
        .get(`/contacts/${contactId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(contactCheck.body.tags).toContainEqual(
        expect.objectContaining({ id: tagId })
      );
    });

    it('should update entities with proper relations', async () => {
      // Mettre à jour le deal avec un nouveau stage
      await request(app.getHttpServer())
        .put(`/deals/${dealId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          stageId: pipelineData.stages[1].id
        })
        .expect(200);

      // Vérifier les mises à jour en cascade
      const updatedDeal = await request(app.getHttpServer())
        .get(`/deals/${dealId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(updatedDeal.body.stageId).toBe(pipelineData.stages[1].id);
    });

    it('should handle deletions with proper cascading', async () => {
      // Supprimer le contact
      await request(app.getHttpServer())
        .delete(`/contacts/${contactId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Vérifier que le deal est toujours là mais sans le contact
      const dealAfterContactDelete = await request(app.getHttpServer())
        .get(`/deals/${dealId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(dealAfterContactDelete.body.contacts).toHaveLength(0);
    });
  });
});