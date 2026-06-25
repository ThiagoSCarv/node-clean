import { describe, expect, it } from 'vitest';
import { createSlug } from './create-slug';

describe('createSlug', () => {
  it('converte um título simples em slug com hífens', () => {
    expect(createSlug('Example Question Title')).toBe('example-question-title');
  });

  it('remove acentos e diacríticos', () => {
    expect(createSlug('Configuração de Ambiente em Português')).toBe(
      'configuracao-de-ambiente-em-portugues',
    );
  });

  it('remove caracteres especiais', () => {
    expect(createSlug('O que é REST? (API!)')).toBe('o-que-e-rest-api');
  });

  it('colapsa espaços e hífens repetidos', () => {
    expect(createSlug('Título   com---espaços')).toBe('titulo-com-espacos');
  });

  it('remove hífens das pontas', () => {
    expect(createSlug('  -Início e fim-  ')).toBe('inicio-e-fim');
  });
});
