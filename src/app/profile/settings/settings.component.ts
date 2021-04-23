import { Component, OnInit } from '@angular/core';

// interfaces
import { User } from '../../models/user.interface';

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
        lastName: '',
        fullName: undefined,
        pictureURL: undefined,
        description: undefined
    }
    
    // input fields
    firstName: string = '';
    lastName: string = '';
    description: string = '';
    password: string = '';
    confirmPassword: string = '';

    // check validators
    profileUpdated: boolean = false;
    passwordUpdated: boolean = false;
    updateError: boolean = false;
    updateErrorPassword: boolean = false;
    errorMessage: string = '';
    updateTimeout: any;

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
        if(this.firstName.length === 0 || this.lastName.length === 0) {
            this.updateError = true;

            if(this.updateTimeout) {
                clearTimeout(this.updateTimeout);
            }

            this.updateTimeout = setTimeout(() => {  
                this.updateError = false;
            }, 2000);
        } else {
            this.profileService.updateProfile(this.currentUser.uuid, this.firstName, this.lastName, this.description)
                .subscribe((success: any) => {
                    this.currentUser = success.user;
                    this.actualDescription = success.description;

                    this.profileUpdated = true;

                    if(this.updateTimeout) {
                        clearTimeout(this.updateTimeout);
                    }

                    this.updateTimeout = setTimeout(() => {  
                        this.profileUpdated = false;
                    }, 2000);
                },
                (error: any) => {
                    console.log(error);

                    this.updateError = true;

                    if(this.updateTimeout) {
                        clearTimeout(this.updateTimeout);
                    }

                    this.updateTimeout = setTimeout(() => {  
                        this.updateError = false;
                    }, 2000);

                    this.firstName = this.currentUser.firstName;
                    this.lastName = this.currentUser.lastName;
                    this.description = this.actualDescription;
                });
        }
        
    }

    changePassword(): void {
        if(this.password.length < 4 || this.confirmPassword.length < 4) {
            this.updateErrorPassword = true;
            this.errorMessage = "Password lenght has to be bigger than 4 characters!"

            console.log(this.updateErrorPassword, this.errorMessage);

            if(this.updateTimeout) {
                clearTimeout(this.updateTimeout);
            }

            this.updateTimeout = setTimeout(() => {  
                this.updateErrorPassword = false;
            }, 2000);

        } else {
            if(this.password !== this.confirmPassword) {
                this.errorMessage = "Confirmed password does not match!";
                this.updateErrorPassword = true;

                
                if(this.updateTimeout) {
                    clearTimeout(this.updateTimeout);
                }

                this.updateTimeout = setTimeout(() => {  
                    this.updateErrorPassword = false;
                }, 2000);

                
            console.log(this.updateErrorPassword, this.errorMessage);
            }
            else {
                this.profileService.changePassword(this.currentUser.uuid, this.password)
                .subscribe(() => {
                
                    if(this.updateTimeout) {
                        clearTimeout(this.updateTimeout);
                    }

                    this.passwordUpdated = true;

                    this.updateTimeout = setTimeout(() => {  
                        this.passwordUpdated = false;
                    }, 2000);
                });
            }
        }
    }
}