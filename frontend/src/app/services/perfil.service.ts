import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../enviroments/enviroment";
import { PerfilResponse } from "../models/perfil-response.model";


@Injectable({ providedIn: 'root' })
export class PerfilService {
  constructor(private http: HttpClient) {}

  getMiPerfil() {
    return this.http.get<PerfilResponse>(`${environment.apiUrl}users/me`);
  }
}
