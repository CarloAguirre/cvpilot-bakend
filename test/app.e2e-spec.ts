import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const createTestUser = async () => {
    const email = `test-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;
    const response = await request(app.getHttpServer()).post('/api/auth/register').send({
      fullName: 'Test User',
      email,
      password: 'Password1',
    });

    return response.body.accessToken as string;
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            name: 'cvpilot-backend',
            status: 'ok',
          }),
        );
      });
  });

  it('/auth/register (POST) rejects weak password', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'weakpass',
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual(
          expect.arrayContaining([
            expect.stringContaining('password must contain at least one uppercase'),
          ]),
        );
      });
  });

  it('/auth/reset-password (POST) rejects weak new password', () => {
    return request(app.getHttpServer())
      .post('/api/auth/reset-password')
      .send({
        token: 'fake-token',
        newPassword: 'weakpass',
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual(
          expect.arrayContaining([
            expect.stringContaining('newPassword must contain at least one uppercase'),
          ]),
        );
      });
  });

  it('/auth/logout (POST) closes session for authenticated user', async () => {
    const accessToken = await createTestUser();

    return request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201)
      .expect((response) => {
        expect(response.body.message).toMatch(/cerrada correctamente/i);
      });
  });

  it('/files/upload (POST) accepts TXT documents', async () => {
    const accessToken = await createTestUser();

    return request(app.getHttpServer())
      .post('/api/files/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', Buffer.from('texto de cv de prueba'), {
        filename: 'cv-test.txt',
        contentType: 'text/plain',
      })
      .expect(201)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            fileExtension: 'txt',
          }),
        );
      });
  });

  it('/reports/by-role (GET) returns user stats for authenticated user', async () => {
    const accessToken = await createTestUser();

    return request(app.getHttpServer())
      .get('/api/reports/by-role')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((response) => {
        expect(Array.isArray(response.body)).toBe(true);
      });
  });
});
