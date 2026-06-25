// Gera um slug a partir de um texto livre (ex.: título de uma question).
// Ex.: "Como configurar o Prisma?" -> "como-configurar-o-prisma".
export function createSlug(text: string): string {
  return text
    .normalize('NFKD') // separa os caracteres dos seus diacríticos
    .replace(/[̀-ͯ]/g, '') // remove os diacríticos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // troca tudo que não for alfanumérico por hífen
    .replace(/^-+|-+$/g, ''); // remove hífens das pontas
}
