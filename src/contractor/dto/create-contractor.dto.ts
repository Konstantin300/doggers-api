import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateContractorDto {
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
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  @ApiProperty({ type: 'string' })
  bio: string;
}
