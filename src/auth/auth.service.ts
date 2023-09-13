import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '../users/type/role.enum';
import { CreateCustomerDto } from 'src/customer/dto/create-customer.dto';
import { Customer } from 'src/customer/entities/customer.entity';
import { UsersService } from 'src/users/users.service';
import { Contractor } from 'src/contractor/entities/contractor.entity';
import { CreateContractorDto } from 'src/contractor/dto/create-contractor.dto';
import { LoginDto } from './dto/login-dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Contractor)
    private contractorsRepository: Repository<Contractor>,

    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async registerContractor(createContractorDto: CreateContractorDto) {
    const { email, password, bio } = createContractorDto;

    const isUserExist = await this.userService.getUserByEmail(email);

    if (isUserExist) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      role: Role.Contractor,
    });

    await this.contractorsRepository.save({
      bio,
      user,
    });

    const savedUser = await this.usersRepository.save(user);

    const token = await this.generateToken(savedUser);

    return {
      ...savedUser,
      password: null,
      token,
    };
  }

  async registerCustomer(createCustomerDto: CreateCustomerDto) {
    const { email, password, name } = createCustomerDto;
    const isUserExist = await this.userService.getUserByEmail(email);

    if (isUserExist) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      role: Role.Customer,
    });

    await this.customerRepository.save({
      name,
      user,
    });

    const savedUser = await this.usersRepository.save(user);

    const token = await this.generateToken(savedUser);
    return {
      ...savedUser,
      password: null,
      token,
    };
  }

  async login(loginDto: LoginDto) {
    console.log('loginDto', loginDto);
    const user = await this.validateUser(loginDto);
    const token = await this.generateToken(user);
    return { ...user, password: null, token };
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id, role: user.role };

    const token = this.jwtService.sign(payload);
    return token;
  }

  private async validateUser(loginDto: LoginDto) {
    const user = await this.userService.getUserByEmail(loginDto.email);
    const passwordEquals = await bcrypt.compare(
      loginDto?.password,
      user?.password,
    );
    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({ message: 'Incorrect email or password' });
  }
}
