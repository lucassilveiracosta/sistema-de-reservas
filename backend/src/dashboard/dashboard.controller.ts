import { Controller, Get, UseGuards , Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { DocsDashboardStatistics, DocsDashboardUserList } from './docs/dashboard.swagger';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Dashboard & Estatísticas')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('statistics')
  @Roles(Role.ADMIN)
  @DocsDashboardStatistics()
  getStatistics() {
    return this.dashboardService.getStatistics();
  }

  @Get('all-users')
  @Roles(Role.ADMIN)
  @DocsDashboardUserList()
  findAllUsersDash(
    
    // Campo de preenchimento para páginação
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    return this.dashboardService.findAllUsersDash(pageNumber, limitNumber)
  }
}
