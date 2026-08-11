import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';

export function DocsUserRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Registra um novo usuário (Colaborador ou Admin)' }),
    ApiBody({ type: CreateUserDto }),
    ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' }),
    ApiResponse({ status: 409, description: 'Email ou CPF já cadastrado.' }),
  );
}

export function DocsUserLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Realiza o login e retorna o token JWT' }),
    ApiBody({ type: LoginUserDto }),
    ApiResponse({ status: 201, description: 'Login efetuado com sucesso (retorna o access_token).' }),
    ApiResponse({ status: 401, description: 'Credenciais inválidas.' }),
  );
}

export function DocsUserAddFavorite() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Adiciona uma sala aos favoritos do usuário logado' }),
    ApiParam({ name: 'roomId', description: 'ID da Sala' }),
    ApiResponse({ status: 201, description: 'Sala adicionada aos favoritos.' }),
    ApiResponse({ status: 404, description: 'Sala não encontrada.' }),
  );
}

export function DocsUserGetFavorites() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Lista todas as salas favoritas do usuário logado' }),
    ApiResponse({ status: 200, description: 'Lista de salas favoritas retornada.' }),
  );
}

export function DocsUserRemoveFavorite() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remove uma sala dos favoritos' }),
    ApiParam({ name: 'roomId', description: 'ID da Sala' }),
    ApiResponse({ status: 200, description: 'Sala removida dos favoritos.' }),
  );
}
