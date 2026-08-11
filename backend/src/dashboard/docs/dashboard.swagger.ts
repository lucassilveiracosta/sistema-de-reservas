import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

export function DocsDashboardStatistics() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Agrega estatísticas gerais para alimentar o Dashboard principal do sistema' }),
    ApiResponse({ status: 200, description: 'Estatísticas estruturadas (Totais de Salas, Total de Reservas e Últimos Compromissos) retornadas com sucesso.' }),
    ApiResponse({ status: 401, description: 'Não autorizado: É necessário fornecer o token de autenticação JWT.' }),
    ApiResponse({ status: 403, description: 'Proibido: Acesso exclusivo para administradores, se as regras de negócio impuserem (Opcional).' }),
    ApiResponse({ status: 500, description: 'Erro interno na agregação dos dados de estatísticas.' })
  );
}
