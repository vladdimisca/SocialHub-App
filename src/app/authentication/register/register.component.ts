import { Component } from '@angular/core';
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

    // fields
    private firstName: string;
    private lastName: string;
    private email: string;
    private password: string;
    private validatePassword: string;

    // validators
    private existingEmail: boolean;
    private passwordsNotMatching: boolean;

    registerUser() {
        this.resetValidators();

        if(this.password !== this.validatePassword) {
            this.passwordsNotMatching = true;
            return;
        }

        const user = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password
        };

        this.authenticationService.register(user).subscribe(
            (token) => { 
                this.resetFields(); 
                this.router.navigate(['/']); 
            },
            //(err) => this.userExists = true;
        );
    }

    resetFields() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.password = '';
        this.validatePassword = '';
    }

    resetValidators() {
        this.existingEmail = false;
        this.passwordsNotMatching = false;
    }
}