import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class FriendsService {
    constructor (
        private httpClient: HttpClient
    ) {}

    getDescription(email: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/getDescriptionByEmail?email=' + email);
    }

    getFriendRequestsByEmail(email: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/getFriendRequestsByEmail?email=' + email);
    }

    getFriendsByEmail(email: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/getFriendsByEmail?email=' + email);
    }

    getProfileImage(email: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/getProfilePicture?email=' + email);
    }

    getUserByEmail(email: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/getUserByEmail?email=' + email);
    }

    checkFriendshipStatus(user: string, userToCheck: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/checkFriendshipStatus?user=' + user + '&userToCheck=' + userToCheck);
    }

    getNumberOfFriendsByEmail(email: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/getNumberOfFriendsByEmail?email=' + email);
    }
}