import { Component, Input, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

// models
import { User } from '../models/user.interface';

// services
import { GlobalService } from '../utils/global.service';
import { NavbarService } from '../navbar/navbar.service';
import { Router } from '@angular/router';

const USERS_SOCKET_ENDPOINT = 'localhost:3000/user-status';

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.scss']
})
export class NavbarComponent implements OnInit { 
    userSocket: io;

    @Input() 
    navLinks: boolean = false;
    
    userProfileLink: string;
    existingUser: boolean;

    // autocomplete
    users: User[] = [];
    searchKeyword: string = 'fullName';
    placeholder: string = 'Search...';
    notFoundMessage: string = 'No results...';
    searchString: string = '';

    constructor(
        private globalService: GlobalService,
        private navbarService: NavbarService,
        private router: Router
    ) {}

    ngOnInit() {
        this.userSocket = io(USERS_SOCKET_ENDPOINT);
        this.existingUser = this.globalService.checkExistingUser();

        if(this.existingUser === true) {
            this.userProfileLink = 'profile/' + this.globalService.getCurrentUser();

            this.navbarService.getAllUsers().subscribe((users: User[]) => {
                this.users = users;

                this.users.forEach(user => {
                    user.fullName = user.firstName + ' ' + user.lastName;

                    this.navbarService.getProfilePicture(user.email).subscribe((pictureURL: string) => {
                        if(pictureURL === null) {
                            user.pictureURL = "assets/images/blank.jpg";
                        } else {
                            user.pictureURL = pictureURL;
                        }
                    });
                });
            });
        }
    }

    logout(): void {
        const email = this.globalService.getCurrentUser();
        this.userSocket.emit('setUserOffline', email);
        
        this.globalService.removeCurrentUser();
        this.globalService.removeToken();
    }

    openProfile(user: User): void {
        this.router.navigateByUrl('profile/' + user.email);
    }
}