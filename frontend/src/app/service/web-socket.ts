import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  public connectionStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  connect(user: any) {
    const socket = new SockJS('/ws');
    this.stompClient = Stomp.over(() => socket);

    this.stompClient.connect({}, (frame: any) => {
      this.connectionStatus$.next(true);
      this.sendJoinNotification(user);
    }, (error: any) => {
      this.connectionStatus$.next(false);
    });
  }

  subscribeToPrivateMessages(username: string, callback: (msg: any) => void) {
    // match the destination with the backend configuration
    this.stompClient.subscribe(`/user/queue/messages`, (payload: any) => {
      callback(JSON.parse(payload.body));
    });
  }

  // Subscribe to status updates
  subscribeToStatusUpdates(callback: (status: any) => void) {
    this.stompClient.subscribe('/topic/status', (payload: any) => {
      callback(JSON.parse(payload.body));
    });
  }

  // Send a message to the server
  sendMessage(message: any) {
    this.stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(message));
  }

  // Notify server of user joining
  private sendJoinNotification(user: any) {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (user && user.id) {
      console.log(`Sending join notification for user: ${user.username}`);
      const joinMessage = {
        senderId: user.id,
        type: 'JOIN'
      };
      this.stompClient.send('/app/chat.addUser', {}, JSON.stringify(joinMessage));
    } else {
      console.error("Could not send Join notification: User data is missing!");
    }
  }
}
