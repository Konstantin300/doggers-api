import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { ContractorModule } from './contractor/contractor.module';
import { PostModule } from './post/post.module';
import { ImagesModule } from './images/images.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ChatModule,

    //   ConfigModule.forRoot({
    //     envFilePath: '.env',
    //     isGlobal: true,
    //     validationSchema: Joi.object({
    //       POSTGRES_HOST: Joi.string().required(),
    //       POSTGRES_PORT: Joi.number().required(),
    //       POSTGRES_USER: Joi.string().required(),
    //       POSTGRES_PASSWORD: Joi.string().required(),
    //       POSTGRES_DB: Joi.string().required(),
    //       PORT: Joi.number().default(3000),
    //     }),
    //   }),
    //   DatabaseModule,
    //   UsersModule,
    //   AuthModule,
    //   CustomerModule,
    //   ContractorModule,
    //   PostModule,
    //   ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
