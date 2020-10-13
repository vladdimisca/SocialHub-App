import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { GlobalService } from '../global.service';

@Injectable({
     providedIn: 'root' 
})
export class LoggedGuard implements CanActivate {
    constructor(
        private router: Router,
        private globalService: GlobalService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.globalService.getCurrentUser();
        const token = this.globalService.getToken();

        if(currentUser && token) {
            this.router.navigate(['/home']); // logged in; redirect to home page 
            return false;
        }
        
        return true;
    }
}