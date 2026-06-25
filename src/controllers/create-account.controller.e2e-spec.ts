import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { compare } from 'bcrypt';
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

describe('Create account (E2E)', () => {
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

  test('[POST] /accounts cria um usuário', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: { email: 'johndoe@example.com' },
    });

    expect(userOnDatabase).toBeTruthy();
    expect(userOnDatabase?.name).toBe('John Doe');
  });

  test('[POST] /accounts armazena a senha com hash e nunca a expõe', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);
    // A resposta nunca deve conter a senha.
    expect(response.body.password).toBeUndefined();

    const userOnDatabase = await prisma.user.findUniqueOrThrow({
      where: { email: 'johndoe@example.com' },
    });

    // A senha persistida deve ser o hash, não o texto puro.
    expect(userOnDatabase.password).not.toBe('123456');
    expect(await compare('123456', userOnDatabase.password)).toBe(true);
  });

  test('[POST] /accounts retorna 409 quando o e-mail já existe', async () => {
    await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Jane Doe',
      email: 'johndoe@example.com',
      password: 'abcdef',
    });

    expect(response.statusCode).toBe(409);

    const usersWithSameEmail = await prisma.user.count({
      where: { email: 'johndoe@example.com' },
    });

    expect(usersWithSameEmail).toBe(1);
  });

  test('[POST] /accounts retorna 400 quando o corpo é inválido', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Jo',
      email: 'not-an-email',
      password: '123',
    });

    expect(response.statusCode).toBe(400);
  });
});
