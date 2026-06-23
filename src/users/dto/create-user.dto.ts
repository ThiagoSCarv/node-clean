import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(3).max(100).meta({
    description: 'Nome completo do usuário',
    example: 'Ada Lovelace',
  }),
  email: z.email().meta({
    description: 'E-mail único do usuário',
    example: 'ada@example.com',
  }),
  password: z.string().min(6).max(100).meta({
    description: 'Senha de acesso (mínimo de 6 caracteres)',
    example: 's3nh4-sup3r-s3gur4',
  }),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}
