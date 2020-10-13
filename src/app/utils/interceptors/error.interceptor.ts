import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as io from 'socket.io-client';

// services
import { GlobalService } from '../global.service';
import { Router } from '@angular/router';

const USERS_SOCKET_ENDPOINT = 'localhost:3000/user-status';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    userSocket: io;

    constructor(
        private globalService: GlobalService,
        private router: Router
    ) {
        this.userSocket = io(USERS_SOCKET_ENDPOINT);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 501) {
                const currentUser = this.globalService.getCurrentUser();
                this.userSocket.emit('setUserOffline', currentUser);

                if(currentUser) {
                    this.globalService.removeCurrentUser();
                }

                if(this.globalService.getToken()) {
                    this.globalService.removeToken();
                } 
        
                this.router.navigateByUrl('/').then(() => {
                    window.location.reload();
                });
            } 

            return throwError(err);
        }));
    }
}