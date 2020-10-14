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

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private globalService: GlobalService,
        private friendsService: FriendsService,
    ) {}

    ngOnInit() {
        this.currentUser = this.globalService.getCurrentUser();

        this.route.params.subscribe((data: Params) => {
            const email = data.user;

            if(email === this.currentUser) {
                this.router.navigate(['friends/friends-list']);
            }

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
        
                    //this.connect();
        
                    this.friends.forEach(friend => {
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
                });
            });

            
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
            //this.friendsSocket.emit('join', this.currentUser);
        });

        this.friendsSocket.on('unfriendSent', (receiver: string) => {
            this.friends = this.friends.filter(user => user.email !== receiver);
        });

        this.friendsSocket.on('unfriendReceived', (sender: string) => {
            this.friends = this.friends.filter(user => user.email !== sender);
        });

        this.friendsSocket.on('requestAccepted', (sender: string) => {
            this.friendsService.getUserByEmail(sender).subscribe((user: User) => {
                const friend: User = {
                    uuid: user.uuid,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    description: '',
                    pictureURL: undefined,
                    fullName: undefined
                }

                this.friendsService.getProfileImage(user.email).subscribe((pictureURL: string) => {
                    if(pictureURL === null) {
                        friend.pictureURL = "assets/images/blank.jpg";
                    } else {
                        friend.pictureURL = pictureURL;
                    }

                    this.friendsService.getDescription(user.email).subscribe((description: string) => {
                        friend.description = description;

                        this.friends.push(friend);
                    });
                });
            });
        });
    }

    removeFriend(email: string): void {
        //this.friendsSocket.emit('unfriendRequest', this.currentUser, email);
    }

    openConversation(uuid: string): void {
        this.router.navigateByUrl('chat/' + uuid);
    }

    openFriendRequests(): void {
        this.router.navigateByUrl('friends/friend-requests');
    }
}