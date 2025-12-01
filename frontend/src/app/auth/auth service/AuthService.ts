import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenKey: string = "jwtToken";

    constructor(private http: HttpClient) {}

    login(username: string, password: string) {
        return this.http.post<{ token: string }>('/api/login',
            {"username": username, "password": password}).
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
}