import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateContractorDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-contractor')
  async registerContractor(@Body() createContractorDto: CreateContractorDto) {
    return await this.authService.registerContractor(createContractorDto);
  }
}
