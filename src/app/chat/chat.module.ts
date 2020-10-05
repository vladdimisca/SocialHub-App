import { NgModule } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { NavbarModule } from '../navbar/navbar.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

// components
import { MessagesComponent } from './messages/messages.component';
import { DirectMessageComponent } from './direct-message/direct-message.component';
import { ConversationComponent } from './conversation/conversation.component';

// services
import { GlobalService } from '../utils/global.service';
import { ChatService } from '../chat/chat.service';

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
        NavbarModule
    ],
    providers: [GlobalService, ChatService],
    bootstrap: []
})
export class ChatModule {}