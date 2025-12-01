import { Component, Injectable } from '@angular/core';
import { AuthService } from '../auth service/AuthService';
import { Router } from '@angular/router';

@Injectable()
@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = "";
  password = "";

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
}
