import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs";
import { AuthRequest } from "../../dto/AuthRequest";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenKey: string = "jwtToken";
    private url = "http://localhost:8080/api";
    constructor(private http: HttpClient) {}

    login(username: string, password: string) {
        const loginRequest = new AuthRequest(username, password);
        
        return this.http.post<{ token: string }>(this.url+'/auth/login',
            loginRequest).
            pipe(tap(res => localStorage.setItem(this.tokenKey, res.token)));
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    signup(username: string, password: string) {
      const authRequest = new AuthRequest(username, password);

      return this.http.post<{ token: string }>(this.url+'/auth/signup', authRequest).pipe(
        tap(res => {localStorage.setItem(this.tokenKey, res.token);}));
    }
}
