import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// interfaces
import { Post } from '../models/post.interface';
import { User } from '../models/user.interface';

// services
import { GlobalService } from '../utils/global.service';
import { HomeService } from './home.service';

@Component({
    selector: 'app-home',
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit { 
    posts: Post[] = []; 

    constructor(
        private globalService: GlobalService,
        private homeService: HomeService
    ) {}

    ngOnInit() {
        const email = this.globalService.getCurrentUser();

        this.homeService.getFriendsPostsByEmail(email).subscribe((posts: Post[]) => {
            this.posts = posts;

            this.posts.forEach(post => {
                this.homeService.getUserByEmail(post.email).subscribe((user: User) => {
                    post.firstName = user.firstName;
                    post.lastName = user.lastName;

                    this.homeService.getProfileImage(post.email).subscribe((pictureURL: string) => {
                        if(pictureURL === null) {
                            post.profilePictureURL = "assets/images/blank.jpg";
                        } else {
                            post.profilePictureURL = pictureURL;
                        }  
                    });
                });
            });
        });
    }
}