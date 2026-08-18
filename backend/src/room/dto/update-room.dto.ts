import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoomDto {
  @ApiProperty({ required: false, example: 'Sala Steve Jobs' })
  name?: string;

  @ApiProperty({ required: false, example: 'Sala reformada' })
  description?: string;

  @ApiProperty({ required: false, example: 15 })
  capacity?: number;

  @ApiProperty({ required: false, description: 'Se a sala está ativa no sistema', default: true })
  isActive?: boolean;
}
