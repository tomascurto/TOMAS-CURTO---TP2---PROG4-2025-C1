import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}auth`;

  constructor(private http: HttpClient) {}

  login(credentials: { usernameOrEmail: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  register(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/registro`, data);
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  autorizar(): Observable<any> {
    const token = this.getToken();
    return this.http.post(
      `${this.baseUrl}/autorizar`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  refrescarToken(): Observable<{ token: string }> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No hay token para refrescar');
    }
    return this.http.post<{ token: string }>(`${this.baseUrl}/refrescar`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  }

}