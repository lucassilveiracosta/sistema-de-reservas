import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto) {
    const { resources, ...roomData } = createRoomDto;
    
    const connectResources: any[] = [];
    if (resources && resources.length > 0) {
      for (const resourceName of resources) {
        let res = await this.prisma.resource.findUnique({ where: { name: resourceName } });
        if (!res) {
          res = await this.prisma.resource.create({ data: { name: resourceName } });
        }
        connectResources.push({
          resource: { connect: { id: res.id } }
        });
      }
    }

    return this.prisma.room.create({
      data: {
        ...roomData,
        resources: {
          create: connectResources,
        }
      },
      include: {
        resources: { include: { resource: true } }
      }
    });
  }

  async findAll(filters: { capacity?: number; resourceId?: string }) {
    const where: any = { isActive: true };
    
    if (filters.capacity) {
      where.capacity = { gte: Number(filters.capacity) };
    }

    if (filters.resourceId) {
      where.resources = {
        some: {
          resourceId: filters.resourceId
        }
      };
    }

    return this.prisma.room.findMany({
      where,
      include: {
        resources: { include: { resource: true } }
      }
    });
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { resources: { include: { resource: true } } }
    });
    if (!room) throw new NotFoundException('Sala não encontrada');
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const { resources, ...roomData } = updateRoomDto;
    
    return this.prisma.room.update({
      where: { id },
      data: roomData,
    });
  }

  async remove(id: string) {
    return this.prisma.room.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
