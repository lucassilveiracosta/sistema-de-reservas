import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando o seeding de usuários...');

  const passwordHash = await bcrypt.hash('senha123', 10);

  // Criar ADMIN
  const admin = await prisma.user.upsert({
    where: { email: 'admin@seedabit.com.br' },
    update: {},
    create: {
      name: 'Administrador Supremo',
      email: 'admin@seedabit.com.br',
      cpf: '000.000.000-00',
      password: passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log('✅ Admin criado:', admin.email);

  // Criar COLLABORATOR 1
  const collab1 = await prisma.user.upsert({
    where: { email: 'joao@seedabit.com.br' },
    update: {},
    create: {
      name: 'João Colaborador',
      email: 'joao@seedabit.com.br',
      cpf: '111.111.111-11',
      password: passwordHash,
      role: Role.USER,
    },
  });
  console.log('✅ Usuário comum 1 criado:', collab1.email);

  // Criar COLLABORATOR 2
  const collab2 = await prisma.user.upsert({
    where: { email: 'maria@seedabit.com.br' },
    update: {},
    create: {
      name: 'Maria Comum',
      email: 'maria@seedabit.com.br',
      cpf: '222.222.222-22',
      password: passwordHash,
      role: Role.USER,
    },
  });
  console.log('✅ Usuário comum 2 criado:', collab2.email);

  console.log('🚀 Seeding de usuários finalizado!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
