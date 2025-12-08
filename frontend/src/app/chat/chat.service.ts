import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from '../model/Chat';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  url = "http://localhost:8080/api/chat"

  constructor(private http: HttpClient) {}

  getChats() {
    return this.http.get<Chat[]>(this.url + "/myChats");
  }
}
