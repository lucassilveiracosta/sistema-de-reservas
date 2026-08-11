import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ description: 'Email corporativo', example: 'joao@seedabit.com' })
  email!: string;

  @ApiProperty({ description: 'Senha de acesso', example: 'SenhaForte123' })
  password!: string;
}
