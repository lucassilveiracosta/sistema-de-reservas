import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { DocsReservationCreate, DocsReservationFindAll, DocsReservationHistory, DocsReservationCancel } from './docs/reservation.swagger';

@ApiTags('Agendamento de Reservas')
@Controller('reservation')
@UseGuards(JwtAuthGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @DocsReservationCreate()
  create(@Request() req, @Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(req.user.id, createReservationDto);
  }

  // Usado para listar e montar o calendário semanal/dashboard (aceita startDate, endDate, roomId)
  @Get()
  @DocsReservationFindAll()
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('roomId') roomId?: string,
    @Query('userId') userId?: string,
  ) {
    return this.reservationService.findAll({ startDate, endDate, roomId, userId });
  }

  @Get('history')
  @DocsReservationHistory()
  getHistory(@Request() req) {
    return this.reservationService.getHistory(req.user.id);
  }

  @Patch(':id/cancel')
  @DocsReservationCancel()
  cancel(@Request() req, @Param('id') id: string) {
    return this.reservationService.cancel(id, req.user.id, req.user.role);
  }
}
