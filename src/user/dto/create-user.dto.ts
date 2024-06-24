import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({
    message: 'Nome é obrigatório',
  })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({
    message: 'Email é obrigatório',
  })
  email: string;

  @IsNotEmpty({
    message: 'Senha é obrigatória',
  })
  password: string;
}
