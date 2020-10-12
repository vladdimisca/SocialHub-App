import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as io from 'socket.io-client';

// services
import { GlobalService } from '../global.service';

const USERS_SOCKET_ENDPOINT = 'localhost:3000/user-status';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    userSocket: io;

    constructor(
        private globalService: GlobalService,
        ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 501) {
                this.logout();
                window.location.reload();
            }

            return throwError(err);
        }))
    }

    logout(): void {
        this.userSocket = io(USERS_SOCKET_ENDPOINT);
        const email = this.globalService.getCurrentUser();

        this.userSocket.emit('offlineUser', email);
        this.userSocket.close();

        if(this.globalService.getToken()) {
            this.globalService.removeToken();
        }

        if(this.globalService.getCurrentUser()) {
            this.globalService.removeCurrentUser();
        }
    }
}