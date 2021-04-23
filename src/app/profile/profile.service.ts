import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ProfileService {
    constructor (
        private httpClient: HttpClient
    ) {}

    getUserByEmail(email: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/getUserByEmail?email=' + email);
    }

    setProfileImage(email: string, image: any): Observable<any> {
        return this.httpClient.post('http://localhost:3000/api/setProfilePicture', {image: image, email: email});
    }

    getProfileImage(email: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/getProfilePicture?email=' + email);
    }

    uploadPhoto(email: string, description: string, image: any, timestamp: number): Observable<any> {
        return this.httpClient.post('http://localhost:3000/api/addPost', {
            email: email,
            description: description,
            image: image,
            timestamp: timestamp
        });
    }

    getPostsByEmail(email: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/getPostsByEmail?email=' + email);
    }

    checkFriendshipStatus(user: string, userToCheck: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/checkFriendshipStatus?user=' + user + '&userToCheck=' + userToCheck);
    }

    getNumberOfFriendsByEmail(email: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/getNumberOfFriendsByEmail?email=' + email);
    }

    updateProfile(uuid: string, newFirstName: string, newLastName: string, newDescription: string): Observable<any> {
        return this.httpClient.put('http://localhost:3000/api/updateProfile', {
            uuid: uuid, 
            firstName: newFirstName, 
            lastName: newLastName,
            description: newDescription
        });
    }

    getDescription(email: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/getDescriptionByEmail?email=' + email);
    }

    getCommentsByPostId(postId: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/getCommentsByPostId?postId=' + postId);
    }

    getLikesByPostId(postId: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/getLikesByPostId?postId=' + postId);
    }
    
    changePassword(uuid: string, password: string): Observable<any> {
        return this.httpClient.put('http://localhost:3000/api/changePassword', {
            uuid: uuid, 
            password: password
        });
    }
}