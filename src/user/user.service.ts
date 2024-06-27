import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existsMail = await this.findByEmail(createUserDto.email).catch(
      () => undefined,
    );

    if (existsMail) {
      throw new NotFoundException('Email já cadastrado');
    }

    createUserDto.password = await hash(createUserDto.password, 14);

    return this.prisma.user.create({
      data: createUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });
  }

  async findOne(id: string): Promise<Partial<UserEntity>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        dropBoxAuth: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByEmail(email: string): Promise<Partial<UserEntity>> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('Nenhum usuário encontrado com esse email');
    }

    return user;
  }

  async update(id: string, data: UpdateUserDto): Promise<void> {
    await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }
}
