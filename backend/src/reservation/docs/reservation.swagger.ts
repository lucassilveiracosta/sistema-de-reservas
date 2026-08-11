import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateReservationDto } from '../dto/create-reservation.dto';

export function DocsReservationCreate() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Cria uma nova reserva validando conflitos de horário' }),
    ApiBody({ type: CreateReservationDto }),
    ApiResponse({ status: 201, description: 'Reserva registrada e confirmada com sucesso.' }),
    ApiResponse({ status: 400, description: 'Requisição inválida: A data de fim é anterior à data de início, ou o formato de datas está incorreto.' }),
    ApiResponse({ status: 401, description: 'Não autorizado: É necessário estar autenticado para reservar uma sala.' }),
    ApiResponse({ status: 404, description: 'Não encontrado: A sala especificada no ID não existe.' }),
    ApiResponse({ status: 409, description: 'Conflito: Já existe uma reserva ativa para esta mesma sala que conflita parcial ou integralmente com o horário solicitado.' }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor ao tentar processar a reserva.' })
  );
}

export function DocsReservationFindAll() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Lista todas as reservas ativas, permitindo construir um calendário' }),
    ApiQuery({ name: 'startDate', required: false, description: 'Filtrar a partir desta Data Inicial (formato ISO 8601)' }),
    ApiQuery({ name: 'endDate', required: false, description: 'Filtrar até esta Data Final (formato ISO 8601)' }),
    ApiQuery({ name: 'roomId', required: false, description: 'Filtrar reservas de uma sala específica (UUID)' }),
    ApiQuery({ name: 'userId', required: false, description: 'Filtrar reservas de um usuário específico (UUID)' }),
    ApiResponse({ status: 200, description: 'Lista da agenda de reservas retornada com sucesso.' }),
    ApiResponse({ status: 400, description: 'Parâmetros de data informados em formato inválido.' }),
    ApiResponse({ status: 401, description: 'Não autorizado.' }),
    ApiResponse({ status: 500, description: 'Erro interno ao buscar as reservas.' })
  );
}

export function DocsReservationHistory() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Obtém o histórico completo de reservas (Passadas e Futuras) do usuário autenticado' }),
    ApiResponse({ status: 200, description: 'Histórico pessoal do usuário retornado, ordenado da mais recente para a mais antiga.' }),
    ApiResponse({ status: 401, description: 'Não autorizado: É necessário um Token JWT válido.' }),
    ApiResponse({ status: 500, description: 'Erro interno ao buscar o histórico.' })
  );
}

export function DocsReservationCancel() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Cancela uma reserva ativa' }),
    ApiParam({ name: 'id', description: 'ID Único da Reserva (UUID)' }),
    ApiResponse({ status: 200, description: 'Reserva alterada para status CANCELLED com sucesso.' }),
    ApiResponse({ status: 401, description: 'Não autorizado: Autenticação obrigatória.' }),
    ApiResponse({ status: 403, description: 'Proibido: Um usuário convencional tentou cancelar uma reserva que pertence a outra pessoa.' }),
    ApiResponse({ status: 404, description: 'Não encontrado: A reserva especificada não existe.' }),
    ApiResponse({ status: 409, description: 'Conflito na regra de negócio.' }),
    ApiResponse({ status: 500, description: 'Erro interno ao processar o cancelamento.' })
  );
}
