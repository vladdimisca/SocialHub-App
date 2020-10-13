import { NgModule } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { NavbarModule } from '../navbar/navbar.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

// pipes
import { DateAgoModule } from '../utils/date-ago/date-ago.module';

// components
import { MessagesComponent } from './messages/messages.component';
import { DirectMessageComponent } from './direct-message/direct-message.component';
import { ConversationComponent } from './conversation/conversation.component';

// services
import { GlobalService } from '../utils/global.service';
import { ChatService } from '../chat/chat.service';

// interceptors
import { JwtInterceptor } from '../utils/interceptors/jwt.interceptor';
import { ErrorInterceptor } from '../utils/interceptors/error.interceptor';

@NgModule({
    declarations: [
        MessagesComponent,
        DirectMessageComponent,
        ConversationComponent
    ],
    imports: [
        AutocompleteLibModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        ChatRoutingModule,
        NavbarModule,
        DateAgoModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        GlobalService,
        ChatService
    ],
    bootstrap: []
})
export class ChatModule {}