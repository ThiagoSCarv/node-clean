import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const userResponseSchema = z.object({
  id: z.uuid().meta({
    description: 'Identificador único do usuário',
    example: '3f1c2a7e-9b6d-4c8a-bf21-2d9a5e7c4b10',
  }),
  name: z.string().meta({
    description: 'Nome completo do usuário',
    example: 'Ada Lovelace',
  }),
  email: z.email().meta({
    description: 'E-mail único do usuário',
    example: 'ada@example.com',
  }),
});

export class UserResponseDto extends createZodDto(userResponseSchema) {}
