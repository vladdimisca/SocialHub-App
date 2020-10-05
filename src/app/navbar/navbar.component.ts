import { Component, Input, OnInit } from '@angular/core';

// models
import { User } from './models/user.interface';

// services
import { GlobalService } from '../utils/global.service';
import { NavbarService } from '../navbar/navbar.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.scss']
})
export class NavbarComponent implements OnInit { 
    @Input() 
    navLinks: boolean = false;
    
    userProfileLink: string;
    existingUser: boolean;
    searchString: string = '';

    // autocomplete
    users: User[] = [];
    searchKeyword: string = 'fullName';
    placeholder: string = 'Search...';
    notFoundMessage: string = 'No results...';

    constructor(
        private globalService: GlobalService,
        private navbarService: NavbarService,
        private router: Router
    ) {}

    ngOnInit() {
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
        this.globalService.removeCurrentUser();
    }

    changeInput(value: string) {
        this.searchString = value;
    }

    openProfile(user: User): void {
        this.router.navigateByUrl('profile/' + user.email);
    }
}