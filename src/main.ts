import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import admin from 'firebase-admin';
import { MulterModule } from '@nestjs/platform-express';

async function bootstrap() {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } catch (e) {
    console.log(e);
  }

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      },
      transform: true,
    }),
  );

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Doggers API')
    .setDescription('The Doggers API description')
    .setVersion('1.0')
    .addTag('dogs')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  MulterModule.register({
    dest: './uploads', // Здесь указывается путь, куда будут сохраняться загруженные файлы
    limits: {
      fieldSize: 5242880, // Максимальный размер файла (в байтах) - здесь 5 МБ
    },
  });

  await app.listen(3000);
}
bootstrap();
