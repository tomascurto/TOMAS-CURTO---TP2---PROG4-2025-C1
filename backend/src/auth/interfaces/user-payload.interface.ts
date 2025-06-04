export interface UserPayload {
  userId: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'usuario' | 'administrador';
  description?: string;
  birthDate?: string;
  profileImage?: string;
}
