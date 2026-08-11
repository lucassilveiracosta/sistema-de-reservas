import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateRoomDto } from '../dto/create-room.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';

export function DocsRoomCreate() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Cria uma nova sala (Apenas ADMIN)' }),
    ApiBody({ type: CreateRoomDto }),
    ApiResponse({ status: 201, description: 'Sala criada com sucesso.' }),
    ApiResponse({ status: 403, description: 'Acesso negado: Perfil insuficiente.' }),
  );
}

export function DocsRoomFindAll() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Lista salas disponíveis com filtro avançado de disponibilidade e horários' }),
    ApiQuery({ name: 'capacity', required: false, description: 'Capacidade mínima', type: Number }),
    ApiQuery({ name: 'resourceId', required: false, description: 'ID do recurso desejado' }),
    ApiQuery({ name: 'startDate', required: false, description: 'Data/hora de início pretendida (ISO)' }),
    ApiQuery({ name: 'endDate', required: false, description: 'Data/hora de fim pretendida (ISO)' }),
    ApiResponse({ status: 200, description: 'Salas retornadas.' }),
  );
}

export function DocsRoomFindOne() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Obtém detalhes de uma sala específica' }),
    ApiParam({ name: 'id', description: 'ID da sala' }),
    ApiResponse({ status: 200, description: 'Detalhes da sala.' }),
    ApiResponse({ status: 404, description: 'Sala não encontrada.' }),
  );
}

export function DocsRoomUpdate() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Atualiza dados de uma sala (Apenas ADMIN)' }),
    ApiParam({ name: 'id', description: 'ID da sala' }),
    ApiBody({ type: UpdateRoomDto }),
    ApiResponse({ status: 200, description: 'Sala atualizada.' }),
    ApiResponse({ status: 403, description: 'Acesso negado.' }),
  );
}

export function DocsRoomRemove() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Desativa uma sala remotamente - Soft delete (Apenas ADMIN)' }),
    ApiParam({ name: 'id', description: 'ID da sala' }),
    ApiResponse({ status: 200, description: 'Sala inativada.' }),
    ApiResponse({ status: 403, description: 'Acesso negado.' }),
  );
}
