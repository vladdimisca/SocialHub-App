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
    }

    checkExistingUser(): boolean {
        return this.cookieService.check('currentUser');
    }
}