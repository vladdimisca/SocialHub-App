import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class GlobalService {
    constructor(
        private router: Router,
        private cookieService: CookieService
    ) {}

    setCurrentUser(user: string): void {
        this.cookieService.set('currentUser', user);
    }

    getCurrentUser(): string {
        return this.cookieService.get('currentUser');
    }
}