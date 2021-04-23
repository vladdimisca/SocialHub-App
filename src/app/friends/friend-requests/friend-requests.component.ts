import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';

// services
import { FriendsService } from '../friends.service';
import { GlobalService } from 'src/app/utils/global.service';

// interfaces
import { User } from '../../models/User.interface';

const FRIENDS_SOCKET_ENDPOINT = 'localhost:3000/friends';

@Component({
    selector: 'friend-requests',
    templateUrl: './friend-requests.component.html',
    styleUrls: ['./friend-requests.component.scss']
})
export class FriendRequestsComponent implements OnInit {
    friendsSocket: io = undefined;
    friendRequests: User[] = [];
    currentUser: string;

    constructor(
        private router: Router,
        private friendsService: FriendsService,
        private globalService: GlobalService
    ) {}
    
    ngOnInit() {
        this.currentUser = this.globalService.getCurrentUser();

        this.setupSocketConnection();

        this.friendsService.getFriendRequestsByEmail(this.currentUser).subscribe((friendRequests: User[]) => {
            this.friendRequests = friendRequests;

            this.connect();

            this.friendRequests.forEach(friendRequest => {
                this.friendsService.getDescription(friendRequest.email).subscribe((description: string) => {
                    friendRequest.description = description;
                });

                this.friendsService.getProfileImage(friendRequest.email).subscribe((pictureURL: string) => {
                    if(pictureURL === null) {
                        friendRequest.pictureURL = "assets/images/blank.jpg";
                    } else {
                        friendRequest.pictureURL = pictureURL;
                    }
                });
            });
        });
    }

    setupSocketConnection(): void {
        this.friendsSocket = io(FRIENDS_SOCKET_ENDPOINT);

        this.friendsSocket.on('connect', () => {
            this.friendsSocket.emit('join', this.currentUser);
        });

        this.friendsSocket.on('requestAccepted', (sender: string, receiver: string) => {
            if(sender === this.currentUser && this.friendRequests.map(user => user.email).includes(receiver)) {
                this.friendRequests = this.friendRequests.filter(friendRequest => friendRequest.email !== receiver);
            } else 
                if(this.friendRequests.map(user => user.email).includes(sender) && receiver === this.currentUser) {
                    this.friendRequests = this.friendRequests.filter(friendRequest => friendRequest.email !== sender)
                }   
        });

        this.friendsSocket.on('requestWithdrawn', (sender: string, receiver: string) => {
            if(this.friendRequests.map(user => user.email).includes(sender) && receiver === this.currentUser) {
                this.friendRequests = this.friendRequests.filter(friendRequest => friendRequest.email !== sender);
            }
        });

        this.friendsSocket.on('requestReceived', (sender: string, receiver: string) => {
            if(receiver === this.currentUser) {
                this.friendsService.getUserByEmail(sender).subscribe((user: User) => {
                    const friend: User = user;
                    friend.description = '';
    
                    this.friendsService.getProfileImage(user.email).subscribe((pictureURL: string) => {
                        if(pictureURL === null) {
                            friend.pictureURL = "assets/images/blank.jpg";
                        } else {
                            friend.pictureURL = pictureURL;
                        }
    
                        this.friendsService.getDescription(user.email).subscribe((description: string) => {
                            friend.description = description;
                            this.friendRequests.push(friend);
                        });
                    });
                });
            }
        });
    }

    connect(): void {
        this.friendRequests.forEach(friendRequest => {
            this.friendsSocket.emit('join', friendRequest.email);
        });
    }

    acceptRequest(email: string): void {
        this.friendsSocket.emit('acceptRequest', this.currentUser, email);
    }

    rejectRequest(email: string): void {
        this.friendsSocket.emit('unsendFriendRequest', email, this.currentUser);
    }

    openFriendsList(): void {
        this.router.navigateByUrl('friends/friends-list');
    }
}