import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../model/Message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = 'http://localhost:8080/api/messages';

  constructor(private http: HttpClient) {}

  createMessage(senderId: number, receiverId: number, encryptedMessage: string): Observable<Message> {
    const messageData = { senderId, receiverId, encryptedMessage };
    return this.http.post<Message>(`${this.apiUrl}/create`, messageData);
  }
}
