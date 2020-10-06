import { Component, OnInit } from '@angular/core';

// interfaces
import { User } from '../models/user.interface';

// services
import { GlobalService } from '../../utils/global.service';
import { ProfileService } from '../profile.service';

@Component({
    selector: 'app-settings',
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.scss']
})
export class SettingsComponent implements OnInit { 
    actualDescription: string = '';
    currentUser: User = {
        uuid: '',
        email: '',
        firstName: '',
        lastName: ''
    }
    
    // input fields
    firstName: string = '';
    lastName: string = '';
    description: string = '';

    constructor ( 
        private globalSevice: GlobalService,
        private profileService: ProfileService
    ) {}

    ngOnInit() {
        const email = this.globalSevice.getCurrentUser();
        
        this.profileService.getUserByEmail(email).subscribe((user: User) => {
            this.currentUser = user;

            this.firstName = this.currentUser.firstName;
            this.lastName = this.currentUser.lastName;

            this.profileService.getDescription(email).subscribe((description: string) => {
                this.actualDescription = description;
                this.description = description;
            });
        }); 
    }

    updateProfile(): void {
        this.profileService.updateProfile(this.currentUser.uuid, this.firstName, this.lastName, this.description)
        .subscribe((success: any) => {
            this.currentUser = success.user;
            this.actualDescription = success.description;
        },
        (error: any) => {
            console.log(error);

            this.firstName = this.currentUser.firstName;
            this.lastName = this.currentUser.lastName;
            this.description = this.actualDescription;
        });
    }

}