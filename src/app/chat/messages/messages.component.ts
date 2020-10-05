import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';

// interfaces
import { UserDetails } from '../models/user-details.interface';

// services
import { GlobalService } from '../../utils/global.service';
import { ChatService } from '../chat.service';
import { ActivatedRoute, Params, Router} from '@angular/router';
import * as io from 'socket.io-client';

const USERS_SOCKET_ENDPOINT = 'localhost:3000/user-status';
const CHAT_SOCKET_ENDPOINT = 'localhost:3000/chat';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnChanges {
    private userSocket: io = undefined;
    private chatSocket: io = undefined;
    connections: UserDetails[] = [];
    onlineUsers: string[] = [];
    selectedUserUUID: string = '';
    currentUserUUID: string;
    unseenArray: string[] = [];
    conversations: string[] = [];

    @Input()
    timestamp: number = 0;

    // input autocomplete
    allUsers: UserDetails[] = [];
    searchKeyword: string = 'fullName';
    placeholder: string = 'Search...';
    notFoundMessage: string = 'No results...';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private chatService: ChatService,
        private globalService: GlobalService
    ) {}

    ngOnInit() {
        const email = this.globalService.getCurrentUser();

        this.route.params.subscribe((data: Params) => {
            this.chatService.getAllUsers().subscribe((users: UserDetails[]) => {
                this.allUsers = users;

                this.allUsers.forEach(user => {
                    user.fullName = user.firstName + ' ' + user.lastName;

                    this.chatService.getProfilePicture(user.email).subscribe((pictureURL: string) => {
                        if(pictureURL === null) {
                            user.pictureURL = "assets/images/blank.jpg";
                        } else {
                            user.pictureURL = pictureURL;
                        }
                    });
                });
            });

            if(this.chatSocket !== undefined) {
                this.chatSocket.close();
            }

            if(this.userSocket !== undefined) {
                this.userSocket.close();
            }

            this.selectedUserUUID = data.conversation;

            this.chatService.getUUID(email).subscribe((response: any) => {
                this.currentUserUUID = response.uuid;
            });

            this.setupSocketConnection();
            this.getConnections();

            this.userSocket.emit('getOnlineUsers');
        });  
    }

    loadChanges(): void {
        this.getConnections();
        this.userSocket?.emit('getOnlineUsers');  
    }

    ngOnChanges() {
        this.loadChanges();
    }

    setupSocketConnection(): void {
        // chat socket
        this.chatSocket = io(CHAT_SOCKET_ENDPOINT);

        this.chatSocket.on('connect', () => {
            this.chatSocket.emit('setRoom', this.globalService.getCurrentUser());
        });

        this.chatSocket.on('seenLastMessage', (receiver: string) => {
            this.unseenArray = this.unseenArray.filter(user => user !== receiver);
        });

        this.chatSocket.on('newMessageSent', () => {
            this.loadChanges();
        });

        //users socket
        this.userSocket = io(USERS_SOCKET_ENDPOINT);

        this.userSocket.on('users', (users: string[]) => {
            this.onlineUsers = users;
        });
    }

    compareUsersArray(currentArray: UserDetails[], newArray: UserDetails[]): boolean {
        const arraysLength = currentArray.length;

        if(arraysLength !== newArray.length) {
            return false;
        }

        for(let index = 0; index < currentArray.length; index++) {
            if(currentArray[index].email !== newArray[index].email) {
                return false;
            }
        }

        return true;
    }

    getConnections(): void {
        this.chatService.getConnectionsByEmail(this.globalService.getCurrentUser()).subscribe((users: UserDetails[]) => {
            if(this.connections === [] || this.compareUsersArray(this.connections, users) === false) {
                for(let conversation of this.conversations) {
                    this.chatSocket.emit('leaveRoom', conversation);
                }

                this.conversations = [];
                this.connections = users;  

                this.connections.forEach(user => {
                    this.checkConversation(user.uuid);
                    this.checkUnseenMessages(user.uuid);

                    const conversationId = this.getConversationId(this.currentUserUUID, user.uuid);
                    this.conversations.push(conversationId);
    
                    this.chatService.getProfilePicture(user.email).subscribe((pictureURL: string) => {
                            if(pictureURL === null) {
                                user.pictureURL = "assets/images/blank.jpg";
                            } else {
                                user.pictureURL = pictureURL;
                            }
                    });
                }); 

                for(let conversation of this.conversations) {
                    this.chatSocket.emit('setRoom', conversation);
                }
            } else {
                this.connections.forEach(user => {
                    this.checkUnseenMessages(user.uuid);
                });
            }
        });
    }

    checkConversation(uuid: string): void {
        this.route.params.subscribe((data: Params) => {
            if(data.conversation === uuid) {
                this.selectedUserUUID = uuid;
            }
        });
    }

    checkUnseenMessages(uuid: string) {
        const currentUser = this.globalService.getCurrentUser();

        this.chatService.getEmailByUUID(uuid).subscribe((email: string) => {
            this.chatService.checkUnseenMessages(currentUser, email).subscribe((status: boolean) => {
                if(status === false) {
                    if(this.unseenArray.includes(email) === false) {
                        this.unseenArray.push(email);
                    }     
                } else {
                    this.unseenArray = this.unseenArray.filter(user => user !== email);
                }
            });
        });
    }

    getConversationId(uuid1: string, uuid2: string) {
        return uuid1 > uuid2 ? uuid2 + '_' + uuid1 : uuid1 + '_' + uuid2;
    }

    openConversation(uuid: string, email: string): void {
        this.unseenArray = this.unseenArray.filter(user => user !== email);

        this.router.navigateByUrl('chat/' + uuid);
    }

    startConversation(user: UserDetails) {
        this.router.navigateByUrl('chat/' + user.uuid);
    }
}