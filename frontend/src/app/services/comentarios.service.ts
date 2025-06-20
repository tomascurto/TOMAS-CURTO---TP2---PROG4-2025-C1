import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class ComentariosService {
    private apiUrl = `${environment.apiUrl}comentarios`;

    constructor(private http: HttpClient) {}

    listarComentarios(publicacionId: string, offset = 0, limit = 5) {
        const params = new HttpParams()
        .set('offset', offset)
        .set('limit', limit);

        return this.http.get<any[]>(`${this.apiUrl}/${publicacionId}`, { params });
    }

    crearComentario(publicacionId: string, mensaje: string) {
        return this.http.post(`${this.apiUrl}/${publicacionId}`, { mensaje });
    }
}
