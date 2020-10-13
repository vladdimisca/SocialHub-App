import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    constructor(
        private cookieService: CookieService
    ) {}

    setCurrentUser(user: string): void {
       this.cookieService.set('currentUser', user);
    }

    getCurrentUser(): string {
        return this.cookieService.get('currentUser');
    }

    removeCurrentUser(): void {
        this.cookieService.delete('currentUser');

        if(this.getRememberedUser()) {
            localStorage.removeItem('rememberedUser');
        }
    }

    checkExistingUser(): boolean {
        return this.cookieService.check('currentUser');
    }

    rememberUser(email: string): void {
        localStorage.setItem('rememberUser', email);
    }

    getRememberedUser(): string {
        return localStorage.getItem('rememberedUser');
    }

    setToken(token: string): void {
        localStorage.setItem('jwtToken', token);
    }

    getToken(): string {
        return localStorage.getItem('jwtToken');
    }

    removeToken(): void {
        localStorage.removeItem('jwtToken');
    }
}