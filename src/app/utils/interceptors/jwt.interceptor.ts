import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GlobalService } from '../global.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private globalService: GlobalService
        ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUser = this.globalService.getCurrentUser();
        const jwtToken = this.globalService.getToken();
        const isLoggedIn = currentUser && jwtToken;
        const isApiUrl = request.url.startsWith('http://localhost:3000');
        
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    'x-access-token': jwtToken
                }
            });
        }

        return next.handle(request);
    }
}