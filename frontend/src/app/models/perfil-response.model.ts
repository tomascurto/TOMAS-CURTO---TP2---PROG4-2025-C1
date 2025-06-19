export interface Usuario {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio?: string;
  profileImageUrl?: string;
}

export interface Comentario {
  _id: string;
  mensaje: string;
  createdAt: string;
  autor: {
    _id: string;
    username: string;
  };
}

export interface Publicacion {
  _id: string;
  titulo: string;
  mensaje: string;
  imagenUrl?: string;
  createdAt: string;
  comentarios: Comentario[];
}

export interface PerfilResponse {
  user: Usuario;
  publicaciones: Publicacion[];
}
