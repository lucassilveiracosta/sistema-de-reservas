import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

export function DocsDashboardStatistics() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Agrega estatísticas gerais para alimentar o Dashboard' }),
    ApiResponse({ status: 200, description: 'Estatísticas de salas, totais de reservas e próximos compromissos.' }),
  );
}
