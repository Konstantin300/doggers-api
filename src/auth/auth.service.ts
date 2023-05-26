import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Contractor } from '../users/entities/contractor.entity';
import { CreateContractorDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../users/type/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Contractor)
    private contractorsRepository: Repository<Contractor>,
  ) {}

  async registerContractor(createContractorDto: CreateContractorDto) {
    const { email, password, bio } = createContractorDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      role: Role.Contractor,
    });

    const contractor = this.contractorsRepository.create({
      bio,
      user,
    });
    await this.contractorsRepository.save(contractor);
    return contractor;
  }
}
