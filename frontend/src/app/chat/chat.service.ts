import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Chat } from '../model/Chat';
import { Message } from '../model/Message';


import  SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  url = "http://localhost:8080/api/";
  private stompClient: any;
  public messageReceived = new Subject<Message>();

  constructor(private http: HttpClient) {}


  initializeWebSocketConnection(chatId: number) {

      const socket = new (SockJS as any)('http://localhost:8080/ws');
      this.stompClient = Stomp.over(socket);



      this.stompClient.connect({}, (frame: any) => {
        console.log('Connected to WebSocket: ' + frame);

        this.stompClient.subscribe(`/topic/messages/${chatId}`, (sdkEvent: any) => {
          this.onMessageReceived(sdkEvent);
        });
      }, (error: any) => {
        console.error('WebSocket connection error: ', error);
      });
    }
  disconnect() {
      if (this.stompClient !== null && this.stompClient !== undefined) {
        this.stompClient.disconnect();
      }
      console.log("Disconnected from WebSocket");
    }

  onMessageReceived(message: any) {
    this.messageReceived.next(JSON.parse(message.body));
  }

  sendWSMessage(senderId: number, recipient: string, content: string) {
    const payload = {
        senderId: senderId,
        recipient_username: recipient,
        content: content
    };
    this.stompClient.send("/app/chat.send", {}, JSON.stringify(payload));
  }


  getChats() {
    return this.http.get<Chat[]>(this.url + "chat/myChats");
  }

  getMessages(myId: number, otherUserName: string) {
    let params = new HttpParams().set('myId', myId).set('otherUsername', otherUserName);
    return this.http.get<Message[]>(this.url + "message/allmessages", { params });
  }

  setRead(id: number, other: string) {
    let param = new HttpParams().set('sender', other).set('reciver', id);
    return this.http.put(this.url + "message/state", null, { params: param });
  }
}
