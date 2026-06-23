import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const authenticateSchema = z.object({
  email: z.email().meta({
    description: 'E-mail cadastrado do usuário',
    example: 'ada@example.com',
  }),
  password: z.string().meta({
    description: 'Senha de acesso do usuário',
    example: 's3nh4-sup3r-s3gur4',
  }),
});

export class AuthenticateDto extends createZodDto(authenticateSchema) {}
