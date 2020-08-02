import { NgModule } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { NavbarModule } from '../navbar/navbar.module';

// components
import { InboxComponent } from './inbox/inbox.component';
import { MessagesComponent } from './messages/messages.component';

// services
import { GlobalService } from '../utils/global.service';

@NgModule({
    declarations: [
        InboxComponent,
        MessagesComponent
    ],
    imports: [
        CommonModule,
        ChatRoutingModule,
        NavbarModule
    ],
    providers: [GlobalService],
    bootstrap: []
})
export class ChatModule {}