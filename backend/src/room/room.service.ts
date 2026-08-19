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

  async findAll(filters: { capacity?: number; startDate?: string; endDate?: string; includeInactive?: boolean }) {
    const where: any = {};
    
    // Se não for pedido explicitamente para incluir inativas, filtra apenas as ativas
    if (!filters.includeInactive) {
      where.isActive = true;
    }

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


  // Altera o status da Sala
  async toggleRoomStatus(id: string) {
    const existingRoom = await this.prisma.room.findFirst({ where: { id: id } });

    if(!existingRoom) throw new NotFoundException('Sala não encontrada.');

    const toggleStatus = await this.prisma.room.update({ 
      where: { id: id },
      data: { isActive: !existingRoom.isActive }
    });
    
    return toggleStatus;
  }

  async remove(id: string) {
    return this.prisma.room.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
