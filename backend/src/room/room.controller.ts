import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { DocsRoomCreate, DocsRoomFindAll, DocsRoomFindOne, DocsRoomUpdate, DocsRoomRemove } from './docs/room.swagger';

@ApiTags('Gerenciamento de Salas')
@Controller('room')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @Roles(Role.ADMIN)
  @DocsRoomCreate()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  @DocsRoomFindAll()
  findAll(
    @Query('capacity') capacity?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    const include = includeInactive === 'true';
    return this.roomService.findAll({ capacity, startDate, endDate, includeInactive: include });
  }

  @Get(':id')
  @DocsRoomFindOne()
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @DocsRoomUpdate()
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Patch(':id/toggle-status')
  @Roles(Role.ADMIN)
  toggleStatus(@Param('id') id: string) {
    return this.roomService.toggleRoomStatus(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @DocsRoomRemove()
  remove(@Param('id') id: string) {
    return this.roomService.remove(id); // Soft delete
  }
}
