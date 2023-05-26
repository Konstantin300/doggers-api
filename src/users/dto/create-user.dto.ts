import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  @ApiProperty({ type: 'string' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string' })
  @Length(8, 255)
  password: string;
}

export class CreateContractorDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  @ApiProperty({ type: 'string' })
  bio: string;
}

export class CreateCustomerDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  @ApiProperty({ type: 'string' })
  name: string;
}
