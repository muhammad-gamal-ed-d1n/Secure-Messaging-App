import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClient],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  activeView = signal<'chat' | 'service'>('chat');

  openMenu() {
    this.activeView.set('chat');
  }

  openService() {
    this.activeView.set('service');
  }
}
