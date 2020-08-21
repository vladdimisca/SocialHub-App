import { Component, OnInit, Output, EventEmitter } from '@angular/core';

// interfaces
import { UserDetails } from '../models/user-details.interface';

// services
import { ChatService } from '../chat.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
    users: UserDetails[] = [];
    currentUUID: string = '';

    @Output()
    changeConversation: EventEmitter<any> = new EventEmitter();

    constructor(
        private route: ActivatedRoute,
        private chatService: ChatService
    ) {}

    ngOnInit() {
        this.getConnections();
    }

    getConnections(): void {
        this.chatService.getUsers().subscribe((users: UserDetails[]) => {
           this.users = users;
           
           this.users.forEach(user => {
               this.checkConversation(user.uuid);
           })
        })
    }

    checkConversation(uuid: string): void {
        this.route.params.subscribe((data: Params) => {
            if(data.conversation === uuid) {
                this.currentUUID = uuid;
            }
        })
    }

    openConversation(uuid: string): void {
        this.changeConversation.emit(uuid);
    }
}