import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto) {
    return this.prisma.room.create({
      data: createRoomDto,
    });
  }

  async findAll(filters: { capacity?: number; startDate?: string; endDate?: string }) {
    const where: any = { isActive: true };
    
    if (filters.capacity) {
      where.capacity = { gte: Number(filters.capacity) };
    }

    // Filtragem avançada: traz apenas salas que NÃO possuem uma reserva conflitante no período
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      
      where.reservations = {
        none: {
          status: 'ACTIVE',
          startTime: { lt: end },
          endTime: { gt: start },
        }
      };
    }

    return this.prisma.room.findMany({
      where,
    });
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });
    if (!room) throw new NotFoundException('Sala não encontrada');
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    return this.prisma.room.update({
      where: { id },
      data: updateRoomDto,
    });
  }

  async remove(id: string) {
    return this.prisma.room.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
