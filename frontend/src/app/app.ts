import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
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
