import { ChangeDetectorRef, Component, Injectable, NgModule, signal } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { AuthService } from '../auth/auth service/AuthService';
import { User } from '../model/User';
import { Chat } from '../model/Chat';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { ChatService } from '../chat/chat.service';
import {HttpClient} from '@angular/common/http';
import {Message} from '../model/Message';
import { AddChatComponent } from "../add-chat-component/add-chat-component";

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
  messagecontent:string='';
  chats!: Chat[];
  currentUser!: User;
  currentChat?: Chat | null;
  messages:Message[]=[];
  constructor(private authService: AuthService,
    private router: Router,
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {

    this.authService.getCurrentUser().subscribe({
      next: (curr: User) => {
        this.currentUser = curr;
        this.cdr.detectChanges();
      }
    })

    this.chatService.getChats().subscribe({
      next: (res: Chat[]) => {
        this.chats = res;

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
    if(this.currentUser && this.currentChat && this.currentChat.otherUsername ){
      this.chatService.getMessages(this.currentUser.id,this.currentChat.otherUsername).subscribe({
        next: (res) => {
          this.messages = res;
          console.log(this.messages);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log("error fetching: " + err);
        }
      });
    }
  }
  sendMessage(){
    if(this.currentUser && this.currentChat && this.currentChat.otherUsername && this.messagecontent.length>0 ){
      console.log("did we make it this time");
      
    this.chatService.sendMessage(this.currentUser.id,this.currentChat.otherUsername,this.messagecontent).subscribe({
      next: (res) => {
        this.messages.push(res);
        this.messagecontent='';
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
  setCurrentChat(user: User) {
    //make a mock chat object that will be discarded if no messages are sent
    this.currentChat = {
      id: -1,
      users: [this.currentUser, user],
      otherUsername: user.username,
    };
  }
}