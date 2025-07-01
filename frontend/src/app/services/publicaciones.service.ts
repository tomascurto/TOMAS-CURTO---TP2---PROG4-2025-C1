import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  private apiUrl = `${environment.apiUrl}publicaciones`;
constructor(private http: HttpClient) {}

  listar(orden: 'fecha' | 'likes' = 'fecha', offset = 0, limit = 10, usuarioId?: string) {
    let params = new HttpParams()
      .set('orden', orden)
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    if (usuarioId) {
      params = params.set('usuarioId', usuarioId);
    }

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  like(id: string) {
    return this.http.post(`${this.apiUrl}/${id}/like`, {});
  }

  unlike(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}/like`);
  }

  obtenerPorId(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  bajaLogica(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  editarPublicacion(id: string, datos: { titulo: string; mensaje: string }) {
    return this.http.put(`${this.apiUrl}/${id}`, datos);
  }
  
    listarBajasPropias(offset = 0, limit = 10) {
      return this.http.get<any[]>(`${this.apiUrl}/bajas/mias?offset=${offset}&limit=${limit}`);
    }
  
  listarBajas(offset: number, limit: number) {
    return this.http.get<any[]>(`${this.apiUrl}/bajas?offset=${offset}&limit=${limit}`);
  }

  rehabilitar(id: string) {
    return this.http.post(`${this.apiUrl}/${id}/rehabilitar`, {});
  }


}
