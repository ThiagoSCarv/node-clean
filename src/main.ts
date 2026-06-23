import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Nest Clean API')
    .setDescription(
      'API de exemplo documentada com Swagger + Zod e renderizada pelo Scalar',
    )
    .setVersion('1.0')
    .addTag('accounts', 'Criação de contas de usuário')
    .addTag('sessions', 'Autenticação de usuários')
    .addBearerAuth()
    .build();

  // `cleanupOpenApiDoc` adapta o documento gerado pelos schemas Zod para OpenAPI.
  const document = cleanupOpenApiDoc(SwaggerModule.createDocument(app, config));

  // Expõe o documento OpenAPI cru em /docs-json (útil para codegen, Postman, etc.).
  SwaggerModule.setup('docs', app, document, { swaggerUiEnabled: false });

  // Renderiza a documentação interativa com a UI do Scalar em /docs.
  app.use('/docs', apiReference({ content: document }));

  const envService = app.get(EnvService);
  await app.listen(envService.get('PORT'));
}
bootstrap();
