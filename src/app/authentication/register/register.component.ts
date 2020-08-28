import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// services
import { AuthenticationService } from '../authentication.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router
    ) {}
    
    private timeout: any;

    // fields
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    validatePassword: string;

    // validators
    alertMessage: string = '';

    registerUser(): void {
        if(this.password !== this.validatePassword) {
            this.alertMessage = "Passwords not matching!"
            
            clearTimeout(this.timeout);

            this.timeout = setTimeout(() => {
                this.alertMessage = '';
            }, 3000)

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
            (error) => {
                this.alertMessage = error.error;

                clearTimeout(this.timeout);

                this.timeout = setTimeout(() => {
                    this.alertMessage = '';
                }, 3000)
            }
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