import {Component, signal} from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-chat-interface',
    imports: [
        RouterOutlet
    ],
  templateUrl: './chat-interface.html',
  styleUrl: './chat-interface.css',
})
export class ChatInterface {
  activeView = signal<'chat' | 'service'>('chat');

  openMenu() {
    this.activeView.set('chat');
  }

  openService() {
    this.activeView.set('service');
  }
}
