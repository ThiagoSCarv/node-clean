import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { EnvService } from '../env/env.service';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(envService: EnvService) {
    // Prisma 7+ usa driver adapters; a conexão é montada a partir do env validado.
    const connectionString = envService.get('DATABASE_URL');

    // O driver adapter NÃO interpreta o `?schema=` da URL, então extraímos o
    // schema e o passamos explicitamente. Em produção é `public`; nos testes
    // E2E é um schema isolado por suíte.
    const schema =
      new URL(connectionString).searchParams.get('schema') ?? 'public';

    const adapter = new PrismaPg({ connectionString }, { schema });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
