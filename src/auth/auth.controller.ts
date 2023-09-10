import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateContractorDto } from '../users/dto/create-user.dto';
import { CreateCustomerDto } from 'src/customer/dto/create-customer.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-contractor')
  async registerContractor(@Body() createContractorDto: CreateContractorDto) {
    return await this.authService.registerContractor(createContractorDto);
  }

  @Post('login')
  async login(@Body() user: any) {
    return await this.authService.login(user);
  }

  @Post('register-customer')
  async registerCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return await this.authService.registerCustomer(createCustomerDto);
  }
}
