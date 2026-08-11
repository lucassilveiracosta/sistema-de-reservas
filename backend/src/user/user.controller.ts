import { Controller, Post, Body, Get, UseGuards, Request, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { DocsUserRegister, DocsUserLogin, DocsUserAddFavorite, DocsUserGetFavorites, DocsUserRemoveFavorite } from './docs/user.docs';

@ApiTags('Usuários & Autenticação')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @DocsUserRegister()
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  @DocsUserLogin()
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorites/:roomId')
  @DocsUserAddFavorite()
  addFavorite(@Request() req, @Param('roomId') roomId: string) {
    return this.userService.addFavoriteRoom(req.user.id, roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  @DocsUserGetFavorites()
  getFavorites(@Request() req) {
    return this.userService.getFavorites(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('favorites/:roomId')
  @DocsUserRemoveFavorite()
  removeFavorite(@Request() req, @Param('roomId') roomId: string) {
    return this.userService.removeFavoriteRoom(req.user.id, roomId);
  }
}
