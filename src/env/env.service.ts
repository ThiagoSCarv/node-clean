import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from './env';

// Wrapper tipado em volta do `ConfigService` do @nestjs/config.
// Garante autocomplete e tipos corretos ao ler variáveis de ambiente.
@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true });
  }
}
