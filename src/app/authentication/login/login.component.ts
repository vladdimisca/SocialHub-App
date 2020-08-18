import { Component } from '@angular/core';
import { Router } from '@angular/router';

// services
import { AuthenticationService } from '../authentication.service';
import { GlobalService } from 'src/app/utils/global.service';

@Component({
    selector: 'app-login',
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.scss']
})
export class LoginComponent { 
    constructor(
        private authenticationService: AuthenticationService,
        private globalService: GlobalService,
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
                this.globalService.setCurrentUser(user.email);
                console.log(this.globalService.getCurrentUser());
                this.resetFields();
                this.router.navigate(['/profile/' + user.email]);
            }, 
            (error) => { console.log(error.error); }
        );
    }

    resetFields() {
        this.email = '';
        this.password = '';
    }
}