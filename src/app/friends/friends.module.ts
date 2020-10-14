import { NgModule } from '@angular/core';

// modules
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FriendsRoutingModule } from './friends-routing.module';
import { NavbarModule } from '../navbar/navbar.module';

// components
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { GeneralFriendsListComponent } from './general-friends-list/general-friends-list.component';

// services
import { GlobalService } from '../utils/global.service';
import { FriendsService } from './friends.service';

// interceptors
import { JwtInterceptor } from '../utils/interceptors/jwt.interceptor';
import { ErrorInterceptor } from '../utils/interceptors/error.interceptor';

@NgModule({
    declarations: [
        FriendRequestsComponent,
        FriendsListComponent,
        GeneralFriendsListComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FriendsRoutingModule,
        NavbarModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        GlobalService, 
        FriendsService
    ],
    bootstrap: []
})
export class FriendsModule {}