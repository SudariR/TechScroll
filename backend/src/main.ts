import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const ok =
        origin === 'http://localhost:3000' ||
        /\.vercel\.app$/.test(new URL(origin).hostname);
      cb(null, ok);
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'x-admin-key'],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  });

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
}
bootstrap();