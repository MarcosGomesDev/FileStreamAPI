import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ReturnUserDto } from '../user/dto/return-user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { validatePassword } from '../utils/password';
import { LoginDto } from './dto/login.dto';
import { LoginPayloadDto } from './dto/loginPaylod.dto';
import { ReturnLogin } from './dto/returnLogin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ReturnLogin> {
    const user: UserEntity | undefined = await this.userService
      .findByEmail(loginDto.email)
      .catch(() => undefined);

    const isMatch = await validatePassword(loginDto.password, user?.password);

    if (!user || !isMatch) {
      throw new NotFoundException('Email or password are invalid!');
    }

    return {
      accessToken: this.jwtService.sign({
        ...new LoginPayloadDto(user),
      }),
      user: new ReturnUserDto(user),
    };
  }

  async register(dto: CreateUserDto): Promise<ReturnLogin> {
    const user = await this.userService.create(dto);

    return {
      accessToken: this.jwtService.sign({
        ...new LoginPayloadDto(user),
      }),
      user: new ReturnUserDto(user),
    };
  }
}
