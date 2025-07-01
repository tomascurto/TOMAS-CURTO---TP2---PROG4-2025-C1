import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}estadisticas`;

  publicacionesPorUsuario(desde: string, hasta: string): Observable<any[]> {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);
    return this.http.get<any[]>(`${this.apiUrl}/publicaciones-por-usuario`, { params });
  }

  totalComentarios(desde: string, hasta: string): Observable<{ cantidad: number }> {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);
    return this.http.get<{ cantidad: number }>(`${this.apiUrl}/total-comentarios`, { params });
  }

  comentariosPorPublicacion(desde: string, hasta: string): Observable<any[]> {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);
    return this.http.get<any[]>(`${this.apiUrl}/comentarios-por-publicacion`, { params });
  }
}