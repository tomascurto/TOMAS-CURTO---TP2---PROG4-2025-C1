import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: 'usuario' | 'administrador';
  profileImageUrl?: string;
  birthDate?: string;
  bio?: string;
  active?: boolean;  
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  disableUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  enableUser(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/enable/${userId}`, {});
  }

  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }
}
