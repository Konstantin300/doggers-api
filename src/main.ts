import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
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

  await app.listen(3000);
}
bootstrap();
