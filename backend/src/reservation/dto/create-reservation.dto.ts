export class CreateReservationDto {
  title!: string;
  startTime!: string; // Esperado string ISO 8601 ex: '2023-10-10T14:00:00.000Z'
  endTime!: string;
  roomId!: string;
}
