import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  register(username: string, password: string, publicKey: string): Observable<User> {
    const registrationData = { username, password, publicKey };
    return this.http.post<User>(`${this.apiUrl}/register`, registrationData);
  }

  login(username: string, password: string): Observable<User> {
    const loginData = { username, password };
    return this.http.post<User>(`${this.apiUrl}/login`, loginData);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {});
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all`);
  }

  getPublicKey(userId: number): Observable<{ publicKey: string }> {
    return this.http.get<{ publicKey: string }>(`${this.apiUrl}/publicKey/${userId}`);
  }
}
