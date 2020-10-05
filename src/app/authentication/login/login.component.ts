import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';

// services
import { AuthenticationService } from '../authentication.service';
import { GlobalService } from 'src/app/utils/global.service';

const SOCKET_ENDPOINT = 'localhost:3000/user-status';

@Component({
    selector: 'app-login',
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit { 
    private socket: io;
    private timeout: any;

    constructor(
        private authenticationService: AuthenticationService,
        private globalService: GlobalService,
        private router: Router
    ) {}

    ngOnInit() {
        this.socket = io(SOCKET_ENDPOINT);
    }

    // fields
    email: string;
    password: string;

    // validators
    alertMessage: string = '';

    login() {
        const user = {
            email: this.email,
            password: this.password
        };

        this.authenticationService.login(user).subscribe(
            (success) => {
                this.globalService.setCurrentUser(user.email);
                this.socket.emit('online', user.email);

                this.resetFields();
                this.router.navigate(['/home']);
            }, 
            (error) => {
                this.alertMessage = error.error.error;

                clearTimeout(this.timeout);

                this.timeout = setTimeout(() => {
                    this.alertMessage = '';
                }, 3000)
            }
        );
    }

    resetFields() {
        this.email = '';
        this.password = '';
    }
}