import { ChangeDetectorRef, Component, Injectable, NgModule, signal } from '@angular/core';
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

@Injectable()
@Component({
  selector: 'app-chat-interface',
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule,
    AddChatComponent
  ],

  templateUrl: './chat-interface.html',
  styleUrl: './chat-interface.css',
})
export class ChatInterface {
  activeView = signal<'chat' | 'service'>('chat');
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
            this.webSocketService.subscribeToPrivateMessages(this.currentUser.username, (newMsg) => {

              if (this.currentChat && newMsg.senderId !== this.currentUser.id) {
                this.messages.push(newMsg);
                this.cdr.detectChanges();
              }
            });
            this.webSocketService.subscribeToStatusUpdates((status) => {
              this.updateUserStatus(status.senderId, status.type);
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
    if (this.currentUser && this.currentChat && this.currentChat.otherUsername && this.messagecontent.length>0) {
      const messageDto = {
        senderId: this.currentUser.id,
        recipientUsername: this.currentChat.otherUsername,
        content: this.messagecontent,
        type: 'CHAT'
      };

      this.webSocketService.sendMessage(messageDto);
      this.chatService.sendMessage(this.currentUser.id, this.currentChat.otherUsername, this.messagecontent).subscribe({

        next: (res) => {
          this.messages.push(res);
          this.messagecontent = '';
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log("failed");
        }
      })
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
    //make a mock chat object that will be discarded if no messages are sent
    this.currentChat = {
      id: -1,
      users: [this.currentUser, user],
      otherUsername: user.username,
    };
  }
  searchChats(searchInput: string) {
    this.filteredChats = this.chats.filter(chat =>
      chat.otherUsername.toLowerCase().includes(searchInput.toLowerCase())
    );
    this.cdr.detectChanges();
  }
}
