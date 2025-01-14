// test/contacts.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Contact } from '../src/modules/contacts/contact.entity';
import { User } from '../src/modules/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserPlan } from '../src/modules/users/user.entity';

describe('Contacts (e2e)', () => {
  let app: INestApplication;
  let contactRepository: Repository<Contact>;
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
    
    contactRepository = moduleFixture.get(getRepositoryToken(Contact));
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
    await contactRepository.delete({});
    await userRepository.delete({});
    await app.close();
  });

  describe('POST /contacts', () => {
    it('should create a contact', () => {
      const createContactDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        company: 'ACME Inc',
      };

      return request(app.getHttpServer())
        .post('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createContactDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject({
            ...createContactDto,
            id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
    });

    it('should validate contact data', () => {
      const invalidContact = {
        firstName: '',
        lastName: 'Doe',
        email: 'invalid-email',
      };

      return request(app.getHttpServer())
        .post('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidContact)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('firstName');
          expect(res.body.message).toContain('email');
        });
    });
  });

  describe('GET /contacts', () => {
    let testContact: Contact;

    beforeEach(async () => {
      testContact = await contactRepository.save({
        firstName: 'Test',
        lastName: 'Contact',
        email: 'test.contact@example.com',
        userId: testUser.id,
      });
    });

    it('should return paginated contacts', () => {
      return request(app.getHttpServer())
        .get('/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            items: expect.any(Array),
            total: expect.any(Number),
            skip: expect.any(Number),
            take: expect.any(Number),
          });
          expect(res.body.items.length).toBeGreaterThan(0);
        });
    });

    it('should filter contacts by search term', () => {
      return request(app.getHttpServer())
        .get('/contacts')
        .query({ search: testContact.firstName })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.items).toContainEqual(
            expect.objectContaining({
              firstName: testContact.firstName,
            }),
          );
        });
    });
  });

  describe('GET /contacts/:id', () => {
    let testContact: Contact;

    beforeEach(async () => {
      testContact = await contactRepository.save({
        firstName: 'Test',
        lastName: 'Contact',
        email: 'test.contact@example.com',
        userId: testUser.id,
      });
    });

    it('should return a contact by id', () => {
      return request(app.getHttpServer())
        .get(`/contacts/${testContact.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            id: testContact.id,
            firstName: testContact.firstName,
            lastName: testContact.lastName,
            email: testContact.email,
          });
        });
    });

    it('should return 404 for non-existent contact', () => {
      return request(app.getHttpServer())
        .get('/contacts/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /contacts/:id', () => {
    let testContact: Contact;

    beforeEach(async () => {
      testContact = await contactRepository.save({
        firstName: 'Test',
        lastName: 'Contact',
        email: 'test.contact@example.com',
        userId: testUser.id,
      });
    });

    it('should update a contact', () => {
      const updateData = {
        firstName: 'Updated',
        company: 'New Company',
      };

      return request(app.getHttpServer())
        .put(`/contacts/${testContact.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            id: testContact.id,
            ...updateData,
            lastName: testContact.lastName,
            email: testContact.email,
          });
        });
    });
  });

  describe('DELETE /contacts/:id', () => {
    let testContact: Contact;

    beforeEach(async () => {
      testContact = await contactRepository.save({
        firstName: 'Test',
        lastName: 'Contact',
        email: 'test.contact@example.com',
        userId: testUser.id,
      });
    });

    it('should delete a contact', async () => {
      await request(app.getHttpServer())
        .delete(`/contacts/${testContact.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Vérifier que le contact a bien été supprimé
      const deletedContact = await contactRepository.findOne({
        where: { id: testContact.id },
      });
      expect(deletedContact).toBeNull();
    });
  });
});