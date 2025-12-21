import { Component, Injectable, signal } from '@angular/core';
import { AuthService } from '../auth service/AuthService';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Injectable()
@Component({
  selector: 'app-login',
  imports: [
    FormsModule

  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = "";
  password = "";
  error = "";
  activeView = signal<'signup' | 'login'>('login');
  signup_screen() {
    this.activeView.set('signup');
  }
  login_screen() {
    this.activeView.set('login');
  }
  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      {
        next: (res) => {
          this.router.navigate(["/app"]);
        },
        error: (err) => {
          if (err.status === 401) {
            this.error = "Invalid username or password"
          }
          else {
            console.log(err)
          }
        }
      }
    );
  }
  signup() {
    const user = {
      username: this.username,
      password: this.password,
    }
    console.log(user);
    this.authService.signup(this.username, this.password).subscribe({
      next: (res) => {
        this.router.navigate(['/app']);
      },
      error: (err) => {
        this.error = err;
      }
    })
  }
  protected readonly RouterLink = RouterLink;
}
