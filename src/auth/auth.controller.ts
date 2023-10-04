import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateContractorDto } from '../users/dto/create-user.dto';
import { CreateCustomerDto } from 'src/customer/dto/create-customer.dto';
import { LoginDto } from './dto/login-dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register new contractor' })
  @Post('register-contractor')
  @ApiResponse({
    status: 201,
    description: 'The registration was successful',
  })
  async registerContractor(@Body() createContractorDto: CreateContractorDto) {
    return await this.authService.registerContractor(createContractorDto);
  }

  @ApiOperation({ summary: 'login' })
  @Post('login')
  async login(@Body() user: LoginDto) {
    return await this.authService.login(user);
  }

  @ApiOperation({ summary: 'Register new customer' })
  @ApiResponse({
    status: 201,
    description: 'The registration was successful',
  })
  @Post('register-customer')
  async registerCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return await this.authService.registerCustomer(createCustomerDto);
  }
}
