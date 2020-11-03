import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import * as io from 'socket.io-client';

// interfaces
import { Post } from '../models/post.interface';
import { User } from '../models/user.interface';
import { Comment } from '../models/comment.interface';

// services
import { GlobalService } from '../utils/global.service';
import { HomeService } from './home.service';
import { ActivatedRoute, Params } from '@angular/router';

const COMMENT_SOCKET_ENDPOINT = 'localhost:3000/comment';

@Component({
    selector: 'app-home',
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit { 
    private commentSocket: io;

    posts: Post[] = []; 

    // pagination fields
    page: number = 1;
    pageSize: number = 5;

    currentUser: string;
    mapCommentsToPosts: Map<String, Comment[]> = new Map<String, Comment[]>(); 
    mapNewCommentToPost: Map<String, string> = new Map<String, string>();  

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
        private route: ActivatedRoute,
        private globalService: GlobalService,
        private homeService: HomeService
    ) {}

    ngOnInit() { 
        const email = this.globalService.getCurrentUser();

        this.homeService.getFriendsPostsByEmail(email).subscribe((posts: Post[]) => {
            this.posts = posts;


        this.route.params.subscribe((data: Params) => {
            if(this.commentSocket !== undefined) {
                this.commentSocket.close();
            }

            this.commentSocket = io(COMMENT_SOCKET_ENDPOINT);

            // broadcast comment
            this.commentSocket.on('comment-broadcast', (comment: Comment) => {
                const commentsArray: Comment[] = this.mapCommentsToPosts.get(comment.postId);
                commentsArray.push(comment);
                this.mapCommentsToPosts.set(comment.postId, commentsArray);
            })

            this.posts.forEach(post => {
                this.commentSocket.on('connect', () => {
                    this.commentSocket.emit('setRoom', post.postId);
                });
                
                this.mapNewCommentToPost.set(post.postId, '');

                this.homeService.getCommentsByPostId(post.postId).subscribe((comments: Comment[]) => {
                    this.mapCommentsToPosts.set(post.postId, comments);
                });

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
    });
}

    addComment(event: any, postId: string): void {
        if(!this.mapNewCommentToPost.get(postId).replace(/\s/g, '').length) {
            this.mapNewCommentToPost.set(postId, '');
            return;
        }
        

        if(event instanceof KeyboardEvent) {
            this.mapNewCommentToPost.set(postId, this.mapNewCommentToPost.get(postId).slice(0, -1));
        } 

        const date = new Date();
        const timestamp = date.getTime();

        const email = this.globalService.getCurrentUser();
        const comment: Comment = {
            commentId: undefined,
            postId: postId,
            senderEmail: email,
            text: this.mapNewCommentToPost.get(postId),
            timestamp: timestamp
        }

        this.commentSocket.emit('comment', comment);
        this.mapNewCommentToPost.set(postId, '');
    }
}