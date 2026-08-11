import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateRoomDto } from '../dto/create-room.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';

export function DocsRoomCreate() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Cria uma nova sala (Requer privilégios de ADMIN)' }),
    ApiBody({ type: CreateRoomDto }),
    ApiResponse({ status: 201, description: 'Sala criada com sucesso.' }),
    ApiResponse({ status: 400, description: 'Requisição inválida: Falha na validação dos dados de entrada.' }),
    ApiResponse({ status: 401, description: 'Não autorizado: Token ausente ou inválido.' }),
    ApiResponse({ status: 403, description: 'Acesso negado: Perfil insuficiente (Somente ADMIN pode criar salas).' }),
    ApiResponse({ status: 500, description: 'Erro interno ao criar sala.' })
  );
}

export function DocsRoomFindAll() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Lista salas disponíveis com filtros avançados' }),
    ApiQuery({ name: 'capacity', required: false, description: 'Filtra salas com capacidade maior ou igual', type: Number }),
    ApiQuery({ name: 'resourceId', required: false, description: 'Filtra salas que contêm o recurso específico' }),
    ApiQuery({ name: 'startDate', required: false, description: 'Data/hora de início pretendida para filtrar ocupação (Padrão ISO 8601)' }),
    ApiQuery({ name: 'endDate', required: false, description: 'Data/hora de fim pretendida para filtrar ocupação (Padrão ISO 8601)' }),
    ApiResponse({ status: 200, description: 'Lista de salas retornada com sucesso, de acordo com os filtros aplicados.' }),
    ApiResponse({ status: 401, description: 'Não autorizado: Token ausente ou inválido.' }),
    ApiResponse({ status: 500, description: 'Erro interno ao processar a busca de salas.' })
  );
}

export function DocsRoomFindOne() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Obtém todos os detalhes de uma sala específica' }),
    ApiParam({ name: 'id', description: 'ID Único da sala (UUID)' }),
    ApiResponse({ status: 200, description: 'Detalhes da sala retornados com sucesso.' }),
    ApiResponse({ status: 401, description: 'Não autorizado: Token ausente.' }),
    ApiResponse({ status: 404, description: 'Não encontrado: Sala inexistente.' }),
    ApiResponse({ status: 500, description: 'Erro interno no servidor.' })
  );
}

export function DocsRoomUpdate() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Atualiza dados de uma sala (Requer privilégios de ADMIN)' }),
    ApiParam({ name: 'id', description: 'ID Único da sala (UUID)' }),
    ApiBody({ type: UpdateRoomDto }),
    ApiResponse({ status: 200, description: 'Sala atualizada com sucesso.' }),
    ApiResponse({ status: 400, description: 'Requisição inválida: Falha na validação do payload.' }),
    ApiResponse({ status: 401, description: 'Não autorizado: Token ausente ou inválido.' }),
    ApiResponse({ status: 403, description: 'Acesso negado: Requer privilégios de ADMIN.' }),
    ApiResponse({ status: 404, description: 'Não encontrado: Sala inexistente.' }),
    ApiResponse({ status: 500, description: 'Erro interno no servidor.' })
  );
}

export function DocsRoomRemove() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Desativa uma sala (Soft Delete) - Requer privilégios de ADMIN' }),
    ApiParam({ name: 'id', description: 'ID Único da sala (UUID)' }),
    ApiResponse({ status: 200, description: 'Sala inativada com sucesso. Ela deixará de aparecer nas buscas.' }),
    ApiResponse({ status: 401, description: 'Não autorizado: Token ausente ou inválido.' }),
    ApiResponse({ status: 403, description: 'Acesso negado: Requer privilégios de ADMIN.' }),
    ApiResponse({ status: 404, description: 'Não encontrado: Sala inexistente ou já inativada.' }),
    ApiResponse({ status: 500, description: 'Erro interno no servidor.' })
  );
}
