import { Component, Input, OnInit } from '@angular/core';

// models
import { User } from './models/user.interface';

// services
import { GlobalService } from '../utils/global.service';
import { NavbarService } from '../navbar/navbar.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.scss']
})
export class NavbarComponent implements OnInit { 
    @Input() 
    navLinks: boolean = false;
    
    subscribeUsers: Subscription;
    userProfileLink: string;
    searchString: string = '';

    constructor(
        private globalService: GlobalService,
        private navbarService: NavbarService,
        private router: Router
    ) {}

    ngOnInit() {
        this.userProfileLink = 'profile/' + this.globalService.getCurrentUser();
    }

    logout(): void {
        this.globalService.removeCurrentUser();
    }

    search(): void {
        if(this.subscribeUsers !== undefined) {
            this.subscribeUsers.unsubscribe();
        }

        this.subscribeUsers = this.navbarService.getUsersByName(this.searchString).subscribe((users: User[]) => {
            console.log(users);
        });
    }
}