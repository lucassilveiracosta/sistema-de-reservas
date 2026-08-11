import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';

export function DocsUserRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Registra um novo usuário (Colaborador ou Admin)' }),
    ApiBody({ type: CreateUserDto }),
    ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' }),
    ApiResponse({ status: 400, description: 'Dados de entrada inválidos (validação do DTO falhou).' }),
    ApiResponse({ status: 409, description: 'Conflito: Email ou CPF já cadastrado no sistema.' }),
    ApiResponse({ status: 500, description: 'Erro interno no servidor ao processar o registro.' })
  );
}

export function DocsUserLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Realiza o login e retorna o token JWT' }),
    ApiBody({ type: LoginUserDto }),
    ApiResponse({ status: 201, description: 'Login efetuado com sucesso. Retorna o access_token JWT.' }),
    ApiResponse({ status: 400, description: 'Requisição mal formatada (falta de e-mail ou senha).' }),
    ApiResponse({ status: 401, description: 'Não autorizado: Credenciais (e-mail ou senha) inválidas.' }),
    ApiResponse({ status: 500, description: 'Erro interno ao processar a autenticação.' })
  );
}

export function DocsUserAddFavorite() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Adiciona uma sala aos favoritos do usuário logado' }),
    ApiParam({ name: 'roomId', description: 'ID Único da Sala (UUID)' }),
    ApiResponse({ status: 201, description: 'Sala adicionada aos favoritos com sucesso.' }),
    ApiResponse({ status: 401, description: 'Não autorizado: Token JWT ausente ou inválido.' }),
    ApiResponse({ status: 404, description: 'Não encontrado: A sala especificada não existe.' }),
    ApiResponse({ status: 409, description: 'Conflito: Esta sala já está nos favoritos deste usuário.' }),
    ApiResponse({ status: 500, description: 'Erro interno ao adicionar aos favoritos.' })
  );
}

export function DocsUserGetFavorites() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Lista todas as salas favoritas do usuário logado' }),
    ApiResponse({ status: 200, description: 'Lista de salas favoritas retornada com sucesso.' }),
    ApiResponse({ status: 401, description: 'Não autorizado: Token JWT ausente ou inválido.' }),
    ApiResponse({ status: 500, description: 'Erro interno ao buscar favoritos.' })
  );
}

export function DocsUserRemoveFavorite() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remove uma sala da lista de favoritos do usuário logado' }),
    ApiParam({ name: 'roomId', description: 'ID Único da Sala (UUID)' }),
    ApiResponse({ status: 200, description: 'Sala removida dos favoritos com sucesso.' }),
    ApiResponse({ status: 401, description: 'Não autorizado: Token JWT ausente ou inválido.' }),
    ApiResponse({ status: 404, description: 'Não encontrado: A sala especificada não foi encontrada ou não está nos favoritos.' }),
    ApiResponse({ status: 500, description: 'Erro interno ao remover dos favoritos.' })
  );
}
