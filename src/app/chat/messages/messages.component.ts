import { Component, OnInit, Output, EventEmitter } from '@angular/core';

// interfaces
import { UserDetails } from '../models/user-details.interface';

// services
import { GlobalService } from '../../utils/global.service';
import { ChatService } from '../chat.service';
import { ActivatedRoute, Params} from '@angular/router';
import * as io from 'socket.io-client';

const SOCKET_ENDPOINT = 'localhost:3000/user-status';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
    private socket: io;
    users: UserDetails[] = [];
    onlineUsers: string[] = [];
    currentUUID: string = '';

    @Output()
    changeConversation: EventEmitter<any> = new EventEmitter();

    constructor(
        private route: ActivatedRoute,
        private chatService: ChatService,
        private globalService: GlobalService
    ) {}

    ngOnInit() {
        this.setupSocketConnection();
        this.getConnections();

        this.socket.emit('getOnlineUsers');
    }

    setupSocketConnection(): void {
        this.socket = io(SOCKET_ENDPOINT);

        this.socket.on('users', (users: string[]) => {
            this.onlineUsers = users;
        });
    }

    getConnections(): void {
        this.chatService.getConnectionsByEmail(this.globalService.getCurrentUser()).subscribe((users: UserDetails[]) => {
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
        if(this.currentUUID !== uuid) {
           this.changeConversation.emit(uuid);
        }
    }
}