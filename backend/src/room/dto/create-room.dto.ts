export class CreateRoomDto {
  name!: string;
  description?: string;
  capacity!: number;
  resources?: string[]; // Nomes dos recursos (ex: ["Projetor", "Ar Condicionado"])
}
