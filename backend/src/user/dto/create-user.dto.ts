import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
  name!: string;

  @ApiProperty({ description: 'Email corporativo', example: 'joao@seedabit.com' })
  email!: string;

  @ApiProperty({ description: 'Senha de acesso', example: 'SenhaForte123' })
  password!: string;

  @ApiProperty({ description: 'CPF do colaborador (opcional)', required: false, example: '123.456.789-00' })
  cpf?: string;

  @ApiProperty({ description: 'Perfil de acesso', enum: ['USER', 'ADMIN'], required: false, default: 'USER' })
  role?: 'USER' | 'ADMIN';
}
