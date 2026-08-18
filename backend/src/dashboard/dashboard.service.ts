import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationStatus, Role } from '@prisma/client';
import { jwtSecret } from 'src/auth/jwt.strategy';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStatistics() {
    const totalRooms = await this.prisma.room.count({ where: { isActive: true } });
    
    const activeReservations = await this.prisma.reservation.count({ where: { status: ReservationStatus.ACTIVE } });
    const completedReservations = await this.prisma.reservation.count({ where: { status: ReservationStatus.COMPLETED } });
    const cancelledReservations = await this.prisma.reservation.count({ where: { status: ReservationStatus.CANCELLED } });
    const totalUsers = await this.prisma.user.count( { where: { role: Role.USER } });

    const upcomingReservations = await this.prisma.reservation.findMany({
      where: {
        status: ReservationStatus.ACTIVE
      },
      include: {
        room: { select: { name: true } },
        user: { select: { name: true } }
      },
      orderBy: { startTime: 'asc' }
    });

    return {
      overview: {
        totalRooms,
        reservations: {
          active: activeReservations,
          completed: completedReservations,
          cancelled: cancelledReservations,
          total: activeReservations + completedReservations + cancelledReservations
        },
        totalUsers: totalUsers
      },
      upcomingReservations
    };
  }
}
