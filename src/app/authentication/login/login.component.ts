import { Component } from '@angular/core';
import { Router } from '@angular/router';

// services
import { AuthenticationService } from '../authentication.service';


@Component({
    selector: 'app-login',
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.scss']
})
export class LoginComponent { 
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router
    ) {}

    // fields
    email: string;
    password: string;

    // validators


    login() {
        const user = {
            email: this.email,
            password: this.password
        };

        this.authenticationService.login(user).subscribe(
            (success) => {
                this.resetFields();
                this.router.navigate(['/home']);
            }, // to be continued ...
            (error) => { console.log(error.error); }
        );
    }

    resetFields() {
        this.email = '';
        this.password = '';
    }
}