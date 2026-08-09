import { Controller, Post, Body, Get, UseGuards, Request, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorites/:roomId')
  addFavorite(@Request() req, @Param('roomId') roomId: string) {
    return this.userService.addFavoriteRoom(req.user.id, roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  getFavorites(@Request() req) {
    return this.userService.getFavorites(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('favorites/:roomId')
  removeFavorite(@Request() req, @Param('roomId') roomId: string) {
    return this.userService.removeFavoriteRoom(req.user.id, roomId);
  }
}
