import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { useContainer } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { email, name, password }: CreateUserDto = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Usuário já cadastrado');
      }
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;

    if (password) {
      updateUserDto.password = await bcrypt.hash(password, 10);
    }

    return await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
