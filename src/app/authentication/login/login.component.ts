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
    private email: string;
    private password: string;

    // validators


    login() {
        const user = {
            email: this.email,
            password: this.password
        };

        this.authenticationService.login(user).subscribe(
            (token) => {
                this.resetFields();
                this.router.navigate(['/home']);
            }, // to be continued ...
            (err) => { console.log(err); }
        );
    }

    resetFields() {
        this.email = '';
        this.password = '';
    }
}