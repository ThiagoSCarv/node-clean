import swc from 'unplugin-swc';
import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// Configuração dos testes unitários.
// O `unplugin-swc` compila os decorators do Nest (experimentalDecorators +
// emitDecoratorMetadata) que o esbuild padrão do Vite não suporta.
export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['src/**/*.spec.ts'],
    // Testes E2E têm sua própria config (vitest.config.e2e.ts).
    exclude: ['**/node_modules/**', '**/*.e2e-spec.ts'],
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
      jsc: {
        target: 'es2023',
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
      },
    }),
  ],
});
