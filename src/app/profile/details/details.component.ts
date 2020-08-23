import { Component, OnInit } from '@angular/core';

//models
import { User } from '../models/user.interface';

//services
import { ProfileService } from '../profile.service';
import { GlobalService } from '../../utils/global.service';

@Component({
    selector: 'app-details',
    templateUrl: 'details.component.html',
    styleUrls: ['details.component.scss']
})
export class DetailsComponent implements OnInit { 
    currentUser: User = {
        uuid: '',
        firstName: '',
        lastName: ''
    }

    constructor(
        private profileService: ProfileService,
        private globalService: GlobalService 
    ) {}

    ngOnInit() {
        this.profileService.getUserByEmail(this.globalService.getCurrentUser()).subscribe((user: User) => {
            this.currentUser = user;
        }) 
    }

}