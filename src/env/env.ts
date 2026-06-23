import { z } from 'zod';

// Schema de validação das variáveis de ambiente.
// É usado em `EnvModule` para garantir, na inicialização, que o `.env`
// contém todas as variáveis necessárias e com os tipos corretos.
export const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().default(3333),
});

export type Env = z.infer<typeof envSchema>;
