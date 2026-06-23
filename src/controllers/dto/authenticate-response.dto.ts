import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const authenticateResponseSchema = z.object({
  access_token: z.string().meta({
    description: 'Token JWT (RS256) a ser enviado no header Authorization',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  }),
});

export class AuthenticateResponseDto extends createZodDto(
  authenticateResponseSchema,
) {}
