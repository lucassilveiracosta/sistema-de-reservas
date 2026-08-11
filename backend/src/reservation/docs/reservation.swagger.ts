import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateReservationDto } from '../dto/create-reservation.dto';

export function DocsReservationCreate() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Cria uma nova reserva (Impede conflitos de horário)' }),
    ApiBody({ type: CreateReservationDto }),
    ApiResponse({ status: 201, description: 'Reserva criada com sucesso.' }),
    ApiResponse({ status: 409, description: 'Já existe uma reserva ativa para esta sala neste horário.' }),
  );
}

export function DocsReservationFindAll() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Lista a agenda de reservas' }),
    ApiQuery({ name: 'startDate', required: false, description: 'Data Inicial (ISO)' }),
    ApiQuery({ name: 'endDate', required: false, description: 'Data Final (ISO)' }),
    ApiQuery({ name: 'roomId', required: false }),
    ApiQuery({ name: 'userId', required: false }),
    ApiResponse({ status: 200, description: 'Lista de reservas retornada.' }),
  );
}

export function DocsReservationHistory() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Obtém o histórico completo de reservas do usuário logado' }),
    ApiResponse({ status: 200, description: 'Histórico retornado.' }),
  );
}

export function DocsReservationCancel() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Cancela uma reserva ativa' }),
    ApiParam({ name: 'id', description: 'ID da Reserva' }),
    ApiResponse({ status: 200, description: 'Reserva cancelada.' }),
    ApiResponse({ status: 409, description: 'Você não tem permissão para cancelar esta reserva.' }),
  );
}
