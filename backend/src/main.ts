import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Serve uploaded files at /uploads/*
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'https://rabzan.com', 'https://www.rabzan.com'],
    credentials: true,
  });

  // Global validation pipe (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error on unknown properties
      transform: true,           // Auto-transform payloads to DTO types
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = configService.get<number>('APP_PORT', 3001);
  await app.listen(port);
  console.log(`🚀 Rabzan Backend running on http://localhost:${port}/api`);
}
bootstrap();
