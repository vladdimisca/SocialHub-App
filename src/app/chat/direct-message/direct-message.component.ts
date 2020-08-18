import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as io from 'socket.io-client';

// interfaces
import { Message } from '../models/message.interface';

// services
import { GlobalService } from '../../utils/global.service';
import { ChatService } from '../chat.service';

const SOCKET_ENDPOINT = 'localhost:3000/chat';
var room = "abcRoom";

@Component({
    selector: 'app-direct-message',
    templateUrl: './direct-message.component.html',
    styleUrls: ['./direct-message.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DirectMessageComponent implements OnInit { 
    private socket: any;
    messageText: string = '';

    private message: Message = {
        chatId: undefined,
        sender: undefined,
        receiver: undefined,
        message: undefined,
        timestamp: undefined
    };
    
    constructor(
        private globalService: GlobalService,
        private chatService: ChatService
    ) {}

    ngOnInit() {
        this.setupSocketConnection();
        this.getMessages(room);
    }

    getMessages(chatId: string): void {
        this.chatService.getMessages(chatId).subscribe((messages: any[]) => {
            messages.forEach(message => {
                if(message.sender === this.globalService.getCurrentUser()) {
                    this.addSenderMessage(message);
                } else {
                    this.addReceiverMessage(message);
                }
            });
        });  
    }

    addSenderMessage(msg: any): void {
        let wrapperDiv = document.createElement('div');
        wrapperDiv.className = 'd-flex justify-content-end mb-4';

        let message = document.createElement('div');
        message.className = 'msg_cotainer_send';
        message.innerHTML = msg.message;

        let msgTime = document.createElement('span');
        msgTime.className = 'msg_time_send';

        msgTime.innerHTML = new Date(msg.timestamp).toLocaleTimeString("en-US");

        message.appendChild(msgTime);
        wrapperDiv.appendChild(message);

        let msgContainer = document.getElementById('msg-container');
        msgContainer.appendChild(wrapperDiv);
    }

    addReceiverMessage(message: any): void {
        let wrapperDiv = document.createElement('div');
        wrapperDiv.className = "d-flex justify-content-start mb-4";

        let imageDiv = document.createElement('div');
        imageDiv.className = 'img_cont_msg';

        let img = document.createElement('img');
        img.className = 'rounded-circle user_img_msg'
        img.src = "https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg";

        let messageDiv = document.createElement('div');
        messageDiv.className = 'msg_cotainer';
        messageDiv.innerHTML = message.message;
                
        let msgTimeSend = document.createElement('span');
        msgTimeSend.className = 'msg_time';

        const date = new Date();

        if(date.getTime() - message.timestamp > 24 * 60 * 60 * 1000) {
            msgTimeSend.innerHTML = new Date(message.timestamp).toLocaleDateString("en-US") + ' ' +
                                            new Date(message.timestamp).toLocaleTimeString("en-US");
        } else {
            msgTimeSend.innerHTML = new Date(message.timestamp).toLocaleTimeString("en-US");
        }
                
        messageDiv.appendChild(msgTimeSend);
        imageDiv.appendChild(img);
        wrapperDiv.appendChild(imageDiv);
        wrapperDiv.appendChild(messageDiv);

        let msgContainer = document.getElementById('msg-container');
        msgContainer.appendChild(wrapperDiv);
    }

    setupSocketConnection() {
        this.socket = io(SOCKET_ENDPOINT);

        this.socket.on('connect', () => {
            this.socket.emit('setRoom', room);
        })

        this.socket.on('message-broadcast', (message: any) => {
            if (message !== undefined) {
                let wrapperDiv = document.createElement('div');
                wrapperDiv.className = "d-flex justify-content-start mb-4";

                let imageDiv = document.createElement('div');
                imageDiv.className = 'img_cont_msg';

                let img = document.createElement('img');
                img.className = 'rounded-circle user_img_msg'
                img.src = "https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg";

                let messageDiv = document.createElement('div');
                messageDiv.className = 'msg_cotainer';
                messageDiv.innerHTML = message.message;
                
                let msgTimeSend = document.createElement('span');
                msgTimeSend.className = 'msg_time';

                const date = new Date();

                if(date.getTime() - message.timestamp > 24 * 60 * 60 * 1000) {
                    msgTimeSend.innerHTML = new Date(message.timestamp).toLocaleDateString("en-US") + ' ' +
                                            new Date(message.timestamp).toLocaleTimeString("en-US");
                } else {
                    msgTimeSend.innerHTML = new Date(message.timestamp).toLocaleTimeString("en-US");
                }
                
                messageDiv.appendChild(msgTimeSend);
                imageDiv.appendChild(img);
                wrapperDiv.appendChild(imageDiv);
                wrapperDiv.appendChild(messageDiv);

                let msgContainer = document.getElementById('msg-container');
                msgContainer.appendChild(wrapperDiv);
            }
        });
    }

    SendMessage() {
        this.message.chatId = room;
        this.message.sender = this.globalService.getCurrentUser() || 'ion';
        this.message.receiver = 'notNow';
        this.message.message = this.messageText;
        
        const date = new Date();
        this.message.timestamp = date.getTime();
    
        this.socket.emit('message', this.message);

        let wrapperDiv = document.createElement('div');
        wrapperDiv.className = 'd-flex justify-content-end mb-4';

        let message = document.createElement('div');
        message.className = 'msg_cotainer_send';
        message.innerHTML = this.message.message;

        let msgTime = document.createElement('span');
        msgTime.className = 'msg_time_send';

        msgTime.innerHTML = new Date(this.message.timestamp).toLocaleTimeString("en-US");

        message.appendChild(msgTime);
        wrapperDiv.appendChild(message);

        let msgContainer = document.getElementById('msg-container');
        msgContainer.appendChild(wrapperDiv);

        this.messageText = '';
    }
}