import {Component, Injectable, signal} from '@angular/core';
import { AuthService } from '../auth service/AuthService';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Injectable()
@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = "";
  password = "";
  activeView = signal<'signup' | 'login'>('login');
  signup_screen(){
    this.activeView.set('signup');
  }
  login_screen(){
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
          console.warn(err);
        }
      }
    );
  }
  signup(){
    const user={
      username:this.username,
      password:this.password,
    }
    console.log(user);
  this.authService.signup(this.username,this.password).subscribe({
    next: (res) => {
      alert("please sing in to continue");
      this.login_screen();
    },
    error: (err) => {
      console.warn(err);
    }
  })
  }
  protected readonly RouterLink = RouterLink;
}
