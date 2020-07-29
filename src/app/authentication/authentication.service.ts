import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {
    constructor(
        private httpClient: HttpClient,
        private router: Router
    ) {}

    register(data: any): Observable<any> {
        return this.httpClient.post('http://localhost:3000/api/register', data);
    }

    login(data: any): Observable<any> {
        return this.httpClient.post('http://localhost:3000/api/login', data);
    }
}