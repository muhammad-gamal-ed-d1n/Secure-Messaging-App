import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat } from '../model/Chat';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:8080/api/chat';

  constructor(private http: HttpClient) {}

  getChatsByUserId(userId: number): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/user/${userId}`);
  }

  createChat(receiverId: number): Observable<Chat> {
    const chatData = { receiverId };
    return this.http.post<Chat>(`${this.apiUrl}/create`, chatData);
  }
}
