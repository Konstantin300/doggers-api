import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Contractor } from '../users/entities/contractor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Contractor])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
