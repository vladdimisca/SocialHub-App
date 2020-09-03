import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class NavbarService {
    constructor(
        private httpClient: HttpClient
    ) {}
    
    getUsersByName(searchString: string): Observable<any> {
        return this.httpClient.get('http://localhost:3000/api/usersByName?searchString=' + searchString);
    }
}