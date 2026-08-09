export class CreateUserDto {
  name!: string;
  email!: string;
  password!: string;
  cpf?: string;
  role?: 'USER' | 'ADMIN';
}
