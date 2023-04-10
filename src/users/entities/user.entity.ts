import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../type/role.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ type: 'string' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: 'string' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ type: 'string' })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({ type: 'string' })
  @Column({ type: 'enum', enum: Role })
  role: Role;
}
