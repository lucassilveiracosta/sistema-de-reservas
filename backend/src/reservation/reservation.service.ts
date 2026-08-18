import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createReservationDto: CreateReservationDto) {
    const start = new Date(createReservationDto.startTime);
    const end = new Date(createReservationDto.endTime);

    // Verifica se a sala existe para não dar erro 500 de Foreign Key
    const room = await this.prisma.room.findUnique({
      where: { id: createReservationDto.roomId }
    });
    
    if (!room) {
      throw new NotFoundException('A sala especificada não foi encontrada.');
    }

    // Validação de horários conflitantes na mesma sala
    const conflicting = await this.prisma.reservation.findFirst({
      where: {
        roomId: createReservationDto.roomId,
        status: ReservationStatus.ACTIVE,
        startTime: { lt: end },
        endTime: { gt: start },
      }
    });

    if (conflicting) {
      throw new ConflictException('Já existe uma reserva ativa para esta sala que conflita com este horário.');
    }

    const conflictingMineReservations = await this.prisma.reservation.findFirst({
      where: {
        userId: userId,
        status: ReservationStatus.ACTIVE,
        startTime: { lt: end },
        endTime: { gt: start }
      }
    })

    if(conflictingMineReservations) throw new ConflictException('Você já realizou uma reserva em alguma sala nesse horário.');

    return this.prisma.reservation.create({
      data: {
        title: createReservationDto.title,
        startTime: start,
        endTime: end,
        userId,
        roomId: createReservationDto.roomId,
      }
    });
  }

  async findAll(filters: { startDate?: string; endDate?: string; roomId?: string; userId?: string }) {
    const where: any = {};
    
    // Filtragem por datas para montar Calendário Semanal ou Dashboard
    if (filters.startDate || filters.endDate) {
      where.startTime = {};
      if (filters.startDate) where.startTime.gte = new Date(filters.startDate);
      if (filters.endDate) where.endTime = { lte: new Date(filters.endDate) };
    }

    if (filters.roomId) where.roomId = filters.roomId;
    if (filters.userId) where.userId = filters.userId;

    return this.prisma.reservation.findMany({
      where,
      include: {
        room: true,
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { startTime: 'asc' }
    });
  }

  async getHistory(userId: string) {
    return this.prisma.reservation.findMany({
      where: { userId },
      include: { room: true },
      orderBy: { startTime: 'desc' }
    });
  }

  async cancel(id: string, userId: string, role: string) {
    const reservation = await this.prisma.reservation.findUnique({ where: { id } });
    if (!reservation) throw new NotFoundException('Reserva não encontrada');

    // Apenas o dono da reserva ou um ADMIN podem cancelar
    if (reservation.userId !== userId && role !== 'ADMIN') {
      throw new ConflictException('Você não tem permissão para cancelar esta reserva');
    }

    return this.prisma.reservation.update({
      where: { id },
      data: { status: ReservationStatus.CANCELLED },
    });
  }
}
