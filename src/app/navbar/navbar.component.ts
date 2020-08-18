import { Component, Input, OnInit } from '@angular/core';

// services
import { GlobalService } from '../utils/global.service';

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.scss']
})
export class NavbarComponent implements OnInit { 
    @Input() 
    navLinks: boolean = false;
    
    userProfileLink: string;

    constructor(
        private globalService: GlobalService
    ) {}

    ngOnInit() {
        this.userProfileLink = 'profile/' + this.globalService.getCurrentUser();
    }
}