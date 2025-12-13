import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  apiUrl = 'http://localhost:8080/api/user'

  constructor(private http: HttpClient) {}

  searchForUserByUsername(username: string) {
    const encodedUsername = encodeURI(username)
    return this.http.get<User[]>(`${this.apiUrl}/search/${encodedUsername}`);
  }
}
