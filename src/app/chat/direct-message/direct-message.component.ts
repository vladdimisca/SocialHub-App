import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import * as io from 'socket.io-client';

// interfaces
import { Message } from '../../models/message.interface';
import { User } from '../../models/user.interface';

// services
import { GlobalService } from '../../utils/global.service';
import { ChatService } from '../chat.service';
import { ActivatedRoute, Params } from '@angular/router';

const CHAT_SOCKET_ENDPOINT = 'localhost:3000/chat';
const USERS_SOCKET_ENDPOINT = 'localhost:3000/user-status';

@Component({
    selector: 'app-direct-message',
    templateUrl: './direct-message.component.html',
    styleUrls: ['./direct-message.component.scss'],
})
export class DirectMessageComponent implements OnInit, AfterViewInit { 
    @ViewChild('scrollframe', {static: false}) scrollFrame: ElementRef;
    @ViewChildren('message') messageElements: QueryList<any>;

    private chatSocket: io;
    private userSocket: io;
    conversation: string;
    messageText: string = '';
    chatId: string = '';
    typing: boolean = false;
    timeout: any;
    typingUser: string = '';
    onlineUsers: string[] = [];
    messages: Message[] = [];
    currentUser: string;

    // file attach
    uploadTimestamp: number;
    uploadedFile: any;

    @Output()
    messagesChange: EventEmitter<any> = new EventEmitter();

    receiver: User = {
        uuid: '',
        firstName: '',
        lastName: '',
        fullName: undefined,
        email: '',
        description: undefined,
        pictureURL: ''
    }

    private message: Message = {
        messageId: undefined,
        chatId: undefined,
        sender: undefined,
        receiver: undefined,
        message: undefined,
        timestamp: undefined,
        seen: false
    };
    
    // view fields
    private scrollContainer: any;
    private isNearBottom = true;

    constructor(
        private route: ActivatedRoute,
        private globalService: GlobalService,
        private chatService: ChatService
    ) {}

    ngAfterViewInit() {
        this.scrollContainer = this.scrollFrame.nativeElement;
        this.messageElements.changes.subscribe(_ => this.onMessageElementsChanged());    
    }

    onMessageElementsChanged() {
        if (this.isNearBottom) {
            this.scrollToBottom();
        }
    }

    private isUserNearBottom(): boolean {
        const threshold = 150;
        const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
        const height = this.scrollContainer.scrollHeight;

        return position > height - threshold;
    }

    private scrollToBottom(): void {
        this.scrollContainer.scroll({
          top: this.scrollContainer.scrollHeight,
          left: 0,
          behavior: 'smooth'
        });
    }

    scrolled(): void {
        this.isNearBottom = this.isUserNearBottom();
    }

    ngOnInit() {
        this.currentUser = this.globalService.getCurrentUser();
        this.setup(); 
    }   

    setup(): void {
        this.route.params.subscribe((data: Params) => {
            if(this.chatSocket !== undefined) {
                this.chatSocket.close();
            }

            if(this.userSocket !== undefined) {
                this.userSocket.close();
            }

            this.conversation = data.conversation;
            
            if(this.conversation !== 'inbox') {
                this.chatService.getUserByUUID(data.conversation).subscribe((user: User) => {          
                    this.receiver = user;

                    this.chatService.getProfilePicture(this.receiver.email).subscribe((pictureURL: string) => {
                        if(pictureURL === null) {
                            this.receiver.pictureURL = "assets/images/blank.jpg";
                        } else {
                            this.receiver.pictureURL = pictureURL;
                        }

                        this.chatService.getUUIDbyEmail(this.globalService.getCurrentUser()).subscribe((success: any) => {
                            this.chatId = success.uuid > data.conversation ?
                                            data.conversation + '_' + success.uuid : 
                                            success.uuid + '_' + data.conversation;
        
                            this.getMessages();   
                            this.setupSocketConnection();
                        });
                    });
                });
            }
        });
    }

    getMessages(): void {
        this.chatService.getMessages(this.chatId).subscribe((messages: Message[]) => { 
            this.messages = messages;

            this.messages.forEach(message => {
                if(message.seen === false) {
                    message.seen = true;
                    this.chatSocket.emit("seenMessage", this.chatId, message.messageId, message.sender, message.receiver, message.timestamp);
                }
            });
        });  
    }

    addSenderMessage(message: Message): void {
        this.messagesChange.emit(message.timestamp);
        this.messages.push(message);
    }

    addReceiverMessage(message: Message): void {
        if(message.seen === false) {
            message.seen = true;
            this.chatSocket.emit("seenMessage", this.chatId, message.messageId, message.sender, message.receiver, message.timestamp);
        }

        this.messagesChange.emit(message.timestamp);
        this.messages.push(message);
    }

    handleDate(event: any): void {
        const element = event.target;

        if(element.tagName.toLowerCase() === 'span') {
           return; 
        }
        
        const timeSpan = element.getElementsByTagName('span')[0];

        if(timeSpan.classList.contains('not-displayed')) {
            timeSpan.classList.remove('not-displayed');
            timeSpan.className += ' displayed';
            element.classList.remove("mb-1");
            element.className += " mb-4";
        } else {
            timeSpan.classList.remove('displayed');
            timeSpan.className += ' not-displayed';
            element.classList.remove("mb-4");
            element.className += " mb-1";
        } 
    }

    stopTyping(): void {
        this.typing = false;
        this.chatSocket.emit('noLongerTyping', this.chatId);
    }

    userIsTyping(): void {
        const time = 1000;

        if(this.typing === false) {
            this.typing = true;
            this.chatSocket.emit('type', this.chatId, this.globalService.getCurrentUser(), this.receiver.email);

            this.timeout = setTimeout(() => {
                this.stopTyping();
            }, time);
        } else {
            clearTimeout(this.timeout);

            this.timeout = setTimeout(() => {
                this.stopTyping();
            }, time);
        }
    }

    setupSocketConnection(): void {
        // chat socket
        this.chatSocket = io(CHAT_SOCKET_ENDPOINT);

        this.chatSocket.on('connect', () => {
            this.chatSocket.emit('setRoom', this.chatId);
        })

        this.chatSocket.on('message-broadcast', (message: Message) => {
            this.messagesChange.emit(message.timestamp);

            if (message !== undefined) {
                if(message.sender === this.globalService.getCurrentUser()) {
                    this.addSenderMessage(message);
                } else {
                    this.addReceiverMessage(message);
                }
            }
        });

        this.chatSocket.on('typing', (receiverEmail: string, firstName: string) => {
            if(receiverEmail === this.globalService.getCurrentUser()) {
                this.typingUser = firstName;
            }  
        });
        
        this.chatSocket.on('stopTyping', () => {
            this.typingUser = '';
        });

        this.chatSocket.on('seen', (messageId: string) => {
            this.messages.forEach(message => {
                if(message.messageId === messageId) {
                    message.seen = true;
                }
            });
        });

        // users socket
        this.userSocket = io(USERS_SOCKET_ENDPOINT);

        this.userSocket.emit('getOnlineUsers');

        this.userSocket.on('onlineUsers', (users: string[]) => {
            this.onlineUsers = users;
        });

        this.userSocket.on('onlineUser', (newUser: string) => {
            if(this.onlineUsers.includes(newUser)) {
                this.onlineUsers.push(newUser);
            }
        });

        this.userSocket.on('offlineUser', (userToRemove: string) => {
            this.onlineUsers = this.onlineUsers.filter(user => user !== userToRemove);
        });
    }

    sendMessage(event: any): void { 
        if(!this.messageText.replace(/\s/g, '').length) {
            this.messageText = '';
            return;
        }

        if(event instanceof KeyboardEvent) {
            this.messageText = this.messageText.slice(0, -1);
        }

        this.message.seen = false;
        this.message.chatId = this.chatId;
        this.message.sender = this.globalService.getCurrentUser();
        this.message.receiver = this.receiver.email;
        this.message.message = this.messageText;
        
        const date = new Date();
        this.message.timestamp = date.getTime();
                
        this.chatSocket.emit('message', this.message);
        this.messageText = '';
    }

    attachFile(event: any): void {
        let file = event.target.files[0];
        let reader = new FileReader();

        reader.onloadend = () => {
            const date = new Date();

            this.uploadTimestamp = date.getTime();
            this.uploadedFile = reader.result;

            if(!this.uploadedFile) {
                return;
            }

            console.log(file.name)
        }; 

        reader.readAsDataURL(file);
    }
}