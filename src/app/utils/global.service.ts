import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalService {
    private currentUser: string;

    constructor(
        private router: Router
    ) {}

    setCurrentUser(user: string) {
        this.currentUser = user;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}