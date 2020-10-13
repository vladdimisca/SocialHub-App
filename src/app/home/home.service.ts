import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HomeService {
    constructor (
        private httpClient: HttpClient
    ) {}

    getUserByEmail(email: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/getUserByEmail?email=' + email);
    }

    getProfileImage(email: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/getProfilePicture?email=' + email);
    }

    getFriendsPostsByEmail(email: string, page: number = 1): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/getFriendsPostsByEmail?email=' + email + '&page=' + page);
    }
}