import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';
import request from 'supertest';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('Authenticate (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  beforeEach(async () => {
    // Cada teste começa com o schema limpo.
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /sessions autentica com credenciais válidas', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await hash('123456', 8),
      },
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });

  test('[POST] /sessions retorna 401 com senha incorreta', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await hash('123456', 8),
      },
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@example.com',
      password: 'senha-errada',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.access_token).toBeUndefined();
  });

  test('[POST] /sessions retorna 401 quando o usuário não existe', async () => {
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'naoexiste@example.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.access_token).toBeUndefined();
  });
});
