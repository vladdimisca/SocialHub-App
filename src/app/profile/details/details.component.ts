import { Component, Input, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

//models
import { User } from '../models/user.interface';

//services
import { ProfileService } from '../profile.service';
import { GlobalService } from '../../utils/global.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

const FRIENDS_SOCKET_ENDPOINT = 'localhost:3000/friends';

@Component({
    selector: 'app-details',
    templateUrl: 'details.component.html',
    styleUrls: ['details.component.scss']
})
export class DetailsComponent implements OnInit { 
    friendsSocket: io = undefined;
    imageSrc: string; 
    selectedFile: any = undefined;
    currentUser: string = '';
    friendshipStatus: string = 'none';
    numberOfFriends: number = 0;
    description: string = '';

    @Input()
    numberOfPosts: number = 0;

    displayedUser: User = {
        uuid: '',
        email: '',
        firstName: '',
        lastName: ''
    }

    constructor(
        private profileService: ProfileService,
        private globalService: GlobalService,
        private route: ActivatedRoute,
        private router: Router 
    ) {}

    ngOnInit() {
        this.currentUser = this.globalService.getCurrentUser();

        this.route.params.subscribe((data: Params) => {
            if(this.friendsSocket !== undefined) {
                this.friendsSocket.close();
            }

            this.setupSocketConnection();

            this.profileService.getUserByEmail(data.user).subscribe((user: User) => {
                this.displayedUser = user;
                
                this.profileService.getNumberOfFriendsByEmail(this.displayedUser.email).subscribe((numberOfFriends: number) => {
                    this.numberOfFriends = numberOfFriends;
                });

                this.profileService.checkFriendshipStatus(this.currentUser, this.displayedUser.email).subscribe((status: string) => {
                    this.friendshipStatus = status;
                });

                this.profileService.getProfileImage(data.user).subscribe((pictureURL: string) => {
                    if(pictureURL === null) {
                        this.imageSrc = "assets/images/blank.jpg";
                    } else {
                        this.imageSrc = pictureURL;
                    }
                });

                this.profileService.getDescription(this.displayedUser.email).subscribe((description: string) => {
                    if(description === '') {
                        this.description = '-';
                    } else {
                        this.description = description;
                    }
                })
            });
        });      
    }

    setupSocketConnection(): void {
        // friends socket
        this.friendsSocket = io(FRIENDS_SOCKET_ENDPOINT);

        this.friendsSocket.on('connect', () => {
            this.friendsSocket.emit('join', this.currentUser);
        });

        this.friendsSocket.on('requestReceived', () => {
            this.friendshipStatus = 'received-request';
        });

        this.friendsSocket.on('requestSent', () => {
            this.friendshipStatus = 'sent-request'
        });

        this.friendsSocket.on('requestAccepted', () => {
            this.friendshipStatus = 'friends';
            this.numberOfFriends++;
        });
        
        this.friendsSocket.on('unfriendSent', () => {
            this.friendshipStatus = 'none';
            this.numberOfFriends--;
        });

        this.friendsSocket.on('unfriendReceived', () => {
            this.friendshipStatus = 'none';
        });

        this.friendsSocket.on('requestUnsent', () => {
            this.friendshipStatus = 'none';
        });

        this.friendsSocket.on('requestWithdrawn', () => {
            this.friendshipStatus = 'none';
        });
    }

    setProfilePicture(event: any): void {
        if(event.target.files[0]['type'].split('/')[0] !== 'image') {
            return;
        }

        let file = event.target.files[0];
        let reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = () => {
            this.selectedFile = reader.result;

            if(this.selectedFile === undefined) {
                return;
            }
            
            const email = this.globalService.getCurrentUser();

            this.profileService.setProfileImage(email, this.selectedFile).subscribe((pictureURL: string) => {
                this.imageSrc = pictureURL;
            });
        }; 
    };

    startConversation(): void {
        this.router.navigateByUrl('chat/' + this.displayedUser.uuid);
    }

    addNewPicture(): void {
        this.router.navigateByUrl('profile/upload-photo');
    }

    addFriend(): void {
        this.friendsSocket.emit('sendRequest', this.currentUser, this.displayedUser.email);
    }

    acceptRequest(): void {
        this.friendsSocket.emit('acceptRequest', this.currentUser , this.displayedUser.email);
    }

    removeFriend(): void {
        this.friendsSocket.emit('unfriendRequest', this.currentUser, this.displayedUser.email);
    }

    unsendRequest(): void {
        this.friendsSocket.emit('unsendFriendRequest', this.currentUser, this.displayedUser.email);
    }

    rejectRequest(): void {
        this.friendsSocket.emit('unsendFriendRequest', this.displayedUser.email, this.currentUser);
    }

    openSettings(): void {
        if(this.friendsSocket !== undefined) {
            this.friendsSocket.close();
        }

        this.router.navigateByUrl('profile/settings');
    }

}