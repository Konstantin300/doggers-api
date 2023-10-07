import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty({
    type: 'any',
    description: `an array of user's avatar images`,
    required: true,
  })
  avatarImages: any;
}
