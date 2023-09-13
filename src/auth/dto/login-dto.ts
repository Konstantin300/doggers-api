import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  @ApiProperty({ type: 'string', description: 'email', required: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string' })
  @Length(8, 255)
  @MinLength(8)
  password: string;
}
