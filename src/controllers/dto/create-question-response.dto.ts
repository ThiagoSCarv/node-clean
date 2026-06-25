import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createQuestionResponseSchema = z.object({
  id: z.uuid().meta({
    description: 'Identificador único da pergunta',
    example: '3f1c2a7e-9b6d-4c8a-bf21-2d9a5e7c4b10',
  }),
  title: z.string().meta({
    description: 'Título da pergunta',
    example: 'Como assinar o JWT com RS256 no NestJS?',
  }),
  slug: z.string().meta({
    description: 'Slug gerado a partir do título',
    example: 'como-assinar-o-jwt-com-rs256-no-nestjs',
  }),
  content: z.string().meta({
    description: 'Conteúdo detalhado da pergunta',
    example: 'Configurei as chaves RSA mas o token não valida. O que falta?',
  }),
  createdAt: z.date().meta({
    description: 'Data de criação da pergunta',
    example: '2026-06-25T12:00:00.000Z',
  }),
});

export class CreateQuestionResponseDto extends createZodDto(
  createQuestionResponseSchema,
) {}
