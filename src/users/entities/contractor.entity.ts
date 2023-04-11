import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('contractors')
export class Contractor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: 'string' })
  @Column({ type: 'varchar', length: 255 })
  bio: string;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;
}
