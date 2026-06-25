import 'dotenv/config';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import { afterAll, beforeAll } from 'vitest';
import { PrismaClient } from '../src/generated/prisma/client';

// Cada arquivo de teste E2E roda em um schema isolado do Postgres, criado
// no `beforeAll` e destruído no `afterAll`. Assim as suítes não interferem
// umas nas outras nem deixam resíduos no banco.

function generateUniqueDatabaseURL(schemaId: string): string {
  if (!process.env.DATABASE_URL) {
    throw new Error('A variável de ambiente DATABASE_URL não foi definida.');
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();
const databaseURL = generateUniqueDatabaseURL(schemaId);

// IMPORTANTE: a URL precisa ser definida AQUI, no topo do setup, antes de o
// arquivo de teste importar o AppModule. O @nestjs/config avalia o
// `ConfigModule.forRoot()` no import-time, capturando process.env.DATABASE_URL
// naquele instante — se mudássemos só no `beforeAll`, o ConfigService já teria
// congelado o schema `public` original.
process.env.DATABASE_URL = databaseURL;

// Adapter do Prisma 7 apontando para o schema único desta suíte (usado apenas
// para o DROP no teardown; a aplicação tem o seu próprio PrismaService).
const adapter = new PrismaPg(
  { connectionString: databaseURL },
  {
    schema: schemaId,
  },
);
const prisma = new PrismaClient({ adapter });

beforeAll(() => {
  // Aplica as migrations no schema recém-criado.
  // `execFileSync` (sem shell) evita qualquer interpolação insegura.
  execFileSync('pnpm', ['prisma', 'migrate', 'deploy'], { stdio: 'inherit' });
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
