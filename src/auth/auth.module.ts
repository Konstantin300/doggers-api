import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { Contractor } from 'src/contractor/entities/contractor.entity';
import { config } from 'dotenv';
import { JwtStrategy } from './jwt.strategy';
config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Contractor, Customer]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy],
})
export class AuthModule {}
