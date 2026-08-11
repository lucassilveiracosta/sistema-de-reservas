import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ description: 'Motivo da reserva', example: 'Reunião de alinhamento trimestral' })
  title!: string;

  @ApiProperty({ description: 'Data/Hora de início em formato ISO', example: '2023-11-10T14:00:00.000Z' })
  startTime!: string;

  @ApiProperty({ description: 'Data/Hora de término em formato ISO', example: '2023-11-10T16:00:00.000Z' })
  endTime!: string;

  @ApiProperty({ description: 'ID da Sala', example: 'd3f9b2d1-2e6b-4e5c-9c04-f8b725b87c71' })
  roomId!: string;
}
