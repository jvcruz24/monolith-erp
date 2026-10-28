import './env.js';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.enableCors({
    origin: (process.env.TRUSTED_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5001);
}

bootstrap();
