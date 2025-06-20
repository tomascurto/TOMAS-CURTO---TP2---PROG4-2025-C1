export class ComentarioResponseDto {
  id!: string;
  mensaje!: string;
  createdAt!: Date;
  modificado!: boolean;
  autor!: {
    id: string;
    username: string;
    profileImageUrl?: string;
  };
}