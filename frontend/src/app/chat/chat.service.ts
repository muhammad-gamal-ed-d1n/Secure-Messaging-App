import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from '../model/Chat';
import {Message} from '../model/Message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  url = "http://localhost:8080/api/"

  constructor(private http: HttpClient) {}

  getChats() {
    return this.http.get<Chat[]>(this.url + "chat/myChats");
  }
  getMessages(myId: number,otherUserName: string) {
    let params = new HttpParams().set('myId', myId).set('otherUsername', otherUserName);
    return this.http.get<Message[]>("http://localhost:8080/api/message/allmessages",{params:params});
  }
  sendMessage(senderId: number,recipient:string, message: string) {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    const payload={
      senderId:senderId,
      recipient_username:recipient,
      content:message
    }
    return this.http.post<Message>("http://localhost:8080/api/message/create", payload);
  }
  setRead(id:number,other:string) {
    let param = new HttpParams().set('sender', other).set('reciver', id);
    return this.http.put("http://localhost:8080/api/message/state",null,{params:param})
  };
}
