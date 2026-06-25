import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const pageQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1).meta({
    description: 'Número da página (20 itens por página)',
    example: 1,
  }),
});

export class PageQueryDto extends createZodDto(pageQuerySchema) {}
