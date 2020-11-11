import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as io from 'socket.io-client';

// services
import { GlobalService } from '../../utils/global.service';
import { FriendsService } from '../friends.service';

// interfaces
import { User } from '../../models/User.interface';

const FRIENDS_SOCKET_ENDPOINT = 'localhost:3000/friends';

@Component({
    selector: 'general-friends-list',
    templateUrl: './general-friends-list.component.html',
    styleUrls: ['./general-friends-list.component.scss']
})
export class GeneralFriendsListComponent implements OnInit {
    friendsSocket: io = undefined;
    friends: User[] = [];
    displayedUser: User;
    currentUser: string;
    friendshipStatus: Map<string, string>;
    numberOfFriends: number = 0;

    // pagination
    page: number = 1;
    pageSize: number = 10;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private globalService: GlobalService,
        private friendsService: FriendsService,
    ) {}

    ngOnInit() {
        this.currentUser = this.globalService.getCurrentUser();

        this.route.params.subscribe((data: Params) => {
            if(this.friendsSocket) {
                this.friendsSocket.close();
            }

            const email = data.user;
            
            if(email === this.currentUser) {
                this.router.navigate(['friends/friends-list']);
                return;
            }

            if(email !== 'friends-list' && email !== 'friend-requests') {
                this.friendsService.getNumberOfFriendsByEmail(email).subscribe((numberOfFriends: number) => {
                    this.numberOfFriends = numberOfFriends;
                });

                this.friendshipStatus = new Map();

                this.friendsService.getUserByEmail(email).subscribe((user: User) => {
                    this.displayedUser = user;

                    this.friendsService.getDescription(this.displayedUser.email).subscribe((description: string) => {
                        this.displayedUser.description = description;
                    });
        
                    this.friendsService.getProfileImage(this.displayedUser.email).subscribe((pictureURL: string) => {
                        if(pictureURL === null) {
                            this.displayedUser.pictureURL = "assets/images/blank.jpg";
                        } else {
                            this.displayedUser.pictureURL = pictureURL;
                        }
                    });

                    this.setupSocketConnection();

                    this.friendsService.getFriendsByEmail(this.displayedUser.email).subscribe((friends: User[]) => {
                        this.friends = friends;
                        this.connect();
            
                        this.friends.forEach(friend => {
                            this.friendsService.checkFriendshipStatus(this.currentUser, friend.email).subscribe((friendshipStatus: string) => {
                                this.friendshipStatus.set(friend.email, friendshipStatus);
                            });

                            this.friendsService.getDescription(friend.email).subscribe((description: string) => {
                                friend.description = description;
                            });
                
                            this.friendsService.getProfileImage(friend.email).subscribe((pictureURL: string) => {
                                if(pictureURL === null) {
                                    friend.pictureURL = "assets/images/blank.jpg";
                                } else {
                                    friend.pictureURL = pictureURL;
                                }
                            });
                        });

                        const interval = setInterval(() => {
                            if(document.documentElement.clientHeight === document.documentElement.scrollHeight) {
                                if(this.page * this.pageSize < this.friends.length) {
                                    this.page++;
                                }
                            } else {
                                clearInterval(interval);
                            }
                        }, 500);
                    });
                });    
            }
        });
    }

    connect(): void {
        this.friends.forEach(friend => {
            this.friendsSocket.emit('join', friend.email);
        });
    }

    setupSocketConnection(): void {
        this.friendsSocket = io(FRIENDS_SOCKET_ENDPOINT);

        this.friendsSocket.on('connect', () => {
            this.friendsSocket.emit('join', this.currentUser);
        }); 

        this.friendsSocket.on('requestSent', (sender: string, receiver: string) => {
            if(sender === this.currentUser &&  this.friendshipStatus.has(receiver)) {
                this.friendshipStatus.set(receiver, 'sent-request');
            }
        });

        this.friendsSocket.on('requestReceived', (sender: string, receiver: string) => {
            if(this.friendshipStatus.has(sender) && receiver === this.currentUser) {
                this.friendshipStatus.set(sender, 'received-request');
            }
        });

        this.friendsSocket.on('unfriendSent', (sender: string, receiver: string) => {
            if(sender === this.currentUser && this.friendshipStatus.has(receiver)) {
                this.friendshipStatus.set(receiver, 'none');
            }
        });

        this.friendsSocket.on('unfriendReceived', (sender: string, receiver: string) => {
            if(this.friendshipStatus.has(sender) && receiver === this.currentUser) {
                this.friendshipStatus.set(sender, 'none');
            }  
        });

        this.friendsSocket.on('requestAccepted', (sender: string, receiver: string) => {
            if(sender === this.currentUser && this.friendshipStatus.has(receiver)) {
                this.friendshipStatus.set(receiver, 'friends');
            } else 
                if(this.friendshipStatus.has(sender) && receiver === this.currentUser) {
                    this.friendshipStatus.set(sender, 'friends');
            } else 
                if(sender === this.displayedUser.email) {
                    this.pushFriend(receiver);
                    this.numberOfFriends++;
                } else 
                    if(receiver === this.displayedUser.email) {
                        this.pushFriend(sender);
                        this.numberOfFriends++;
                    }
        });

        this.friendsSocket.on('requestUnsent', (sender: string, receiver: string) => {
            if(sender === this.currentUser && this.friendshipStatus.has(receiver)) {
                this.friendshipStatus.set(receiver, 'none');
            }  
        });

        this.friendsSocket.on('requestWithdrawn', (sender: string, receiver: string) => {
            if(this.friendshipStatus.has(sender) && receiver === this.currentUser) {
                this.friendshipStatus.set(sender, 'none');  
            }
        });
    }

    pushFriend(newFriend: string): void {
        this.friendsService.getUserByEmail(newFriend).subscribe((friend: User) => {
            friend.description = '';
            this.friends.push(friend);

            this.friendsService.getDescription(newFriend).subscribe((description: string) => {
                friend.description = description;
            });

            this.friendsService.getProfileImage(newFriend).subscribe((pictureURL: string) => {
                friend.pictureURL = pictureURL;
            });

            this.friendsService.checkFriendshipStatus(this.currentUser, newFriend).subscribe((status: string) => {
                this.friendshipStatus.set(newFriend, status);
            });
        });   
    }

    removeFriend(email: string): void {
        this.friendsSocket.emit('unfriendRequest', this.currentUser, email);
    }

    addFriend(email: string): void {
        this.friendsSocket.emit('sendRequest', this.currentUser, email);
    }

    acceptRequest(email: string): void {
        this.friendsSocket.emit('acceptRequest', this.currentUser, email);
    }

    unsendRequest(email: string): void {
        this.friendsSocket.emit('unsendFriendRequest', this.currentUser, email);
    }

    rejectRequest(email: string): void {
        this.friendsSocket.emit('unsendFriendRequest', email, this.currentUser);
    }

    openConversation(uuid: string): void {
        this.router.navigateByUrl('chat/' + uuid);
    }
}