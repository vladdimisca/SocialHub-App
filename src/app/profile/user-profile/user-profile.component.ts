import { Component } from '@angular/core';

// services
import { GlobalService } from 'src/app/utils/global.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: 'user-profile.component.html',
    styleUrls: ['user-profile.component.scss']
})
export class UserProfileComponent { 
    constructor(
        private globalService: GlobalService
    ) {}
}