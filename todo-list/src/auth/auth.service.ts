import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new NotFoundException('Usuário ou senha inválidos');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new NotFoundException('Usuário ou senha inválidos');
    }

    const payload = { email: user.email, userid: user.id };

    const token = await this.jwtService.signAsync(payload);

    return {
      token: token,
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.usersService.create({
      ...createUserDto,
    });

    const payload = { email: user.email, userid: user.id, name: user.name };

    const token = await this.jwtService.signAsync(payload);

    return {
      token: token,
    };
  }
}
