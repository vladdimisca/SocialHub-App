import { Component, OnInit, HostListener } from '@angular/core';
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

    // pagination fields
    page: number = 1;
    pageSize: number = 5;

    @HostListener('window:scroll', ['$event']) 
    onWindowScroll() {
        const position = (document.documentElement.scrollTop || document.body.scrollTop);
        const max = document.documentElement.scrollHeight - document.documentElement.clientHeight ;
    
        if(position >= max - 5 )   {
            if(this.page === this.posts.length / this.pageSize) {
                this.page++;
                const email = this.globalService.getCurrentUser();

                this.homeService.getFriendsPostsByEmail(email, this.page).subscribe((posts: Post[]) => {
                    posts.forEach(post => {
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
                    this.posts = this.posts.concat(posts);
                });  
            } 
        }
    }

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