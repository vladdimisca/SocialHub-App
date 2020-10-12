import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { GlobalService } from '../global.service';

@Injectable({
     providedIn: 'root' 
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private globalService: GlobalService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.globalService.getCurrentUser();

        if(currentUser) {
            return true;
        }

        this.router.navigate(['/']); // not logged in; redirect to login page 
        return false;
    }
}