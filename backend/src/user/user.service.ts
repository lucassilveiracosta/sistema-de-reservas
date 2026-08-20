import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { take } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          ...(createUserDto.cpf ? [{ cpf: createUserDto.cpf }] : []),
        ]
      }
    });

    if (existing) {
      throw new ConflictException('Email ou CPF já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        cpf: createUserDto.cpf,
        role: (createUserDto.role as Role) || Role.USER,
      },
    });

    // Remove a senha do retorno
    const { password, ...result } = user;
    return result;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    };
  }

  

  async addFavoriteRoom(userId: string, roomId: string) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Sala não encontrada');

    return this.prisma.favoriteRoom.upsert({
      where: {
        userId_roomId: { userId, roomId }
      },
      update: {},
      create: {
        userId,
        roomId
      }
    });
  }

  async getFavorites(userId: string) {
    return this.prisma.favoriteRoom.findMany({
      where: { userId },
      include: {
        room: true,
      }
    });
  }

  async removeFavoriteRoom(userId: string, roomId: string) {
    return this.prisma.favoriteRoom.delete({
      where: {
        userId_roomId: { userId, roomId }
      }
    });
  }
}
