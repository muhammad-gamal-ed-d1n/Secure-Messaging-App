import {ChangeDetectorRef, Component, ElementRef, Injectable, NgModule, signal, ViewChild, OnInit} from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { AuthService } from '../auth/auth service/AuthService';
import { User } from '../model/User';
import { Chat } from '../model/Chat';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { ChatService } from '../chat/chat.service';
import { WebSocketService } from '../service/web-socket';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Message} from '../model/Message';
import { AddChatComponent } from "../add-chat-component/add-chat-component";
import { filter } from 'rxjs';
import { EncryptionService } from "../encryption-service/encryption-service";

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule,
    AddChatComponent,
    EncryptionService
],
  templateUrl: './chat-interface.html',
  styleUrls: ['./chat-interface.css'],
})
export class ChatInterface implements OnInit {
  activeView = signal<'chat' | 'service'>('chat');
  @ViewChild('scrollContainer') private myScrollContainer!: ElementRef;
  scrollToBottom():void{
    if(this.myScrollContainer){
      const element = this.myScrollContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
  displaySearch: boolean = false;
  messagecontent: string = '';
  chats!: Chat[];
  filteredChats!: Chat[];
  currentUser!: User;
  currentChat?: Chat | null;
  messages: Message[] = [];

  constructor(private authService: AuthService,
    private router: Router,
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private webSocketService: WebSocketService
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (curr: User) => {
        this.currentUser = curr;
        this.webSocketService.connect(this.currentUser);
        this.webSocketService.connectionStatus$.subscribe(isConnected => {

          if (isConnected) {
            console.log("WebSocket connected, now subscribing...");
            this.webSocketService.subscribeToPrivateMessages(this.currentUser.username, (msg:any) => {

              if (this.currentChat && msg.senderId === this.currentChat.users.find(u => u.id !== this.currentUser.id)?.id) {
                this.messages.push(msg);
                this.scrollToBottom();
                this.cdr.detectChanges();
                // Immediately mark messages as read on the server when the recipient
                // has the chat open so the original sender is notified via websocket.
                try {
                  if (this.currentChat && this.currentChat.otherUsername) {
                    this.chatService.setRead(this.currentUser.id, this.currentChat.otherUsername).subscribe({
                      next: () => {},
                      error: (err) => { console.error('Failed to mark messages read', err); }
                    });
                  }
                } catch (e) {
                  console.error(e);
                }
              }
            });
            this.webSocketService.subscribeToStatusUpdates((status) => {
              this.updateUserStatus(status.senderId, status.type);
            });
              this.webSocketService.subscribeToMessageStatus((status: any) => {
                // status contains senderUsername, reciverUsername, state
                try {
                  if (!this.currentUser) return;
                  // If this client is the original sender of messages that were marked read
                  if (status.senderUsername === this.currentUser.username) {
                    const recUser = status.reciverUsername;
                    if (this.currentChat && this.currentChat.otherUsername === recUser) {
                      this.messages.forEach(m => {
                        if (m.senderId === this.currentUser.id) {
                          m.state = 'read';
                        }
                      });
                      this.cdr.detectChanges();
                    }
                  }
                } catch (e) { console.error(e); }
              });
          }
        });
        this.cdr.detectChanges();
      }
    });

    this.chatService.getChats().subscribe({
      next: (res: Chat[]) => {
        this.chats = res;
        this.filteredChats = this.chats;

        for(let i = 0; i < this.chats.length; i++) {
          this.chats[i].otherUsername = this.getOtherUsername(this.chats[i]);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  fetchMessages(): void {
    if (this.currentUser && this.currentChat && this.currentChat.otherUsername) {
      this.chatService.getMessages(this.currentUser.id, this.currentChat.otherUsername).subscribe({
        next: (res) => {
          this.messages = res;
          console.log(this.messages);
          this.cdr.detectChanges();
          setTimeout(() => this.scrollToBottom(), 50);
        },
        error: (err) => {
          console.log("error fetching: " + err);
        }
      });
     this.chatService.setRead(this.currentUser.id,this.currentChat.otherUsername).subscribe({
       next: (res) => {
       },
       error: (err) => {
       }
     })
    }
  }


  sendMessage() {
    if (this.currentUser && this.currentChat && this.currentChat.otherUsername && this.messagecontent.length > 0) {
      const messageDto = {
        senderId: this.currentUser.id,
        recipientUsername: this.currentChat.otherUsername,
        content: this.messagecontent,
        type: 'CHAT'
      };

      this.webSocketService.sendMessage(messageDto);

      this.messages.push({
        senderId: this.currentUser.id,
        content: this.messagecontent,
        received: false,
        state: 'NotRead',
        timeStamp: new Date().toISOString()
      } as any);

      this.scrollToBottom();
      this.messagecontent = '';
      this.cdr.detectChanges();
    }
  }

  openMenu() {
    this.activeView.set('chat');
  }

  openService() {
    this.activeView.set('service');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getOtherUsername(chat: Chat) {
    return chat.users.filter(u => u.username !== this.currentUser.username)[0].username;
  }

  updateUserStatus(userId: number, statusType: string) {
    const targetId = Number(userId);
    console.log(`Updating status for user ${targetId} to ${statusType}`);

    this.chats.forEach(chat => {
      if (chat.users.some(u => Number(u.id) === targetId)) {
        chat.isOnline = (statusType === 'JOIN');
      }
    });
    if (this.currentChat && this.currentChat.users.some(u => Number(u.id) === targetId)) {
      this.currentChat.isOnline = (statusType === 'JOIN');
    }
    this.cdr.detectChanges();
  }

  setCurrentChat(user: User) {
    this.currentChat = {
      id: -1,
      users: [this.currentUser, user],
      otherUsername: user.username,
    };
    this.messages = [];
    this.fetchMessages();
    this.cdr.detectChanges();
  }
  searchChats(searchInput: string) {
    this.filteredChats = this.chats.filter(chat =>
      chat.otherUsername.toLowerCase().includes(searchInput.toLowerCase())
    );
    this.cdr.detectChanges();
  }
}
