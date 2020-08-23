import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ProfileService {
    constructor (
        private httpClient: HttpClient
    ) {}

    getUserByEmail(email: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/userByEmail?email=' + email);
    }
}