import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// services
import { AuthenticationService } from '../authentication.service';
import { GlobalService } from 'src/app/utils/global.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    constructor(
        private authenticationService: AuthenticationService,
        private globalService: GlobalService,
        private router: Router
    ) {}

    // fields
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    validatePassword: string;

    // validators
    messageToDisplay: string;

    registerUser(): void {
        if(this.password !== this.validatePassword) {
            return;
        }

        const user = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password
        };

        this.authenticationService.register(user).subscribe(
            (success) => { 
                this.resetFields(); 
                this.router.navigate(['/']); 
            },
            (error) => { console.log(error.error); }
        );
    }

    resetFields(): void {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.password = '';
        this.validatePassword = '';
    }
}