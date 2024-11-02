import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsEmail({}, { message: 'O e-mail precisa ser um endereço de e-mail válido.' })
    email: string;

    @IsString({ message: 'O nome deve ser um texto.' })
    name: string;

    @IsString({ message: 'A senha deve ser um texto.' })
    @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
    password: string;
}
