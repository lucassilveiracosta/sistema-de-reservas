import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ description: 'Nome da sala', example: 'Sala Steve Jobs' })
  name!: string;

  @ApiProperty({ description: 'Descrição da sala', required: false, example: 'Sala de reuniões no 2º andar' })
  description?: string;

  @ApiProperty({ description: 'Capacidade de pessoas', example: 10 })
  capacity!: number;
}
