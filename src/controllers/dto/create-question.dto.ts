import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createQuestionSchema = z.object({
  title: z.string().min(1).max(120).meta({
    description: 'Título da pergunta',
    example: 'Como assinar o JWT com RS256 no NestJS?',
  }),
  content: z.string().min(1).meta({
    description: 'Conteúdo detalhado da pergunta',
    example: 'Configurei as chaves RSA mas o token não valida. O que falta?',
  }),
});

export class CreateQuestionDto extends createZodDto(createQuestionSchema) {}
