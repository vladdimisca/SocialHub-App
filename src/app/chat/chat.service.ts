import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ChatService {
    constructor(
        private httpClient: HttpClient
    ) {}

    getMessages(chatId: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/chat?chatId=' + chatId);
    }

    getConnectionsByEmail(email: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/connections?email=' + email);
    }

    getUUID(email: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/userUUID?email=' + email);
    }

    getEmailByUUID(uuid: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/userEmail?uuid=' + uuid);
    }

    getUserByUUID(uuid: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/user?uuid=' + uuid)
    }

    getProfilePicture(email: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/getProfilePicture?email=' + email);
    }

    checkUnseenMessages(sender: string, receiver: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/checkUnseenMessages?sender=' + sender + '&receiver=' + receiver);
    }

    getAllUsers(): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/users');
    }
}