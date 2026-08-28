import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({ origin: origins, credentials: true });
  app.setGlobalPrefix('api');

  // Railway injects PORT — must bind 0.0.0.0, not localhost
  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
}
bootstrap();