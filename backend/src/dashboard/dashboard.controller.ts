import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { DocsDashboardStatistics } from './docs/dashboard.swagger';
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
}
