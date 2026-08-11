import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStatistics() {
    const totalRooms = await this.prisma.room.count({ where: { isActive: true } });
    
    const activeReservations = await this.prisma.reservation.count({ where: { status: ReservationStatus.ACTIVE } });
    const completedReservations = await this.prisma.reservation.count({ where: { status: ReservationStatus.COMPLETED } });
    const cancelledReservations = await this.prisma.reservation.count({ where: { status: ReservationStatus.CANCELLED } });

    // Próximas reservas (7 dias)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcomingReservations = await this.prisma.reservation.findMany({
      where: {
        status: ReservationStatus.ACTIVE,
        startTime: {
          gte: new Date(),
          lte: nextWeek
        }
      },
      include: {
        room: { select: { name: true } },
        user: { select: { name: true } }
      },
      orderBy: { startTime: 'asc' },
      take: 10
    });

    return {
      overview: {
        totalRooms,
        reservations: {
          active: activeReservations,
          completed: completedReservations,
          cancelled: cancelledReservations,
          total: activeReservations + completedReservations + cancelledReservations
        }
      },
      upcomingReservations
    };
  }
}
