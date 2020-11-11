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
import { ProfileService } from '../profile/profile.service';
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

    currentUserEmail: string;
    currentUser: User;
    mapCommentsToPosts: Map<String, Comment[]> = new Map<String, Comment[]>(); 
    mapNewCommentToPost: Map<String, string> = new Map<String, string>();  
    mapUserToComment: Map<String, User> = new Map<String, User>();
    mapUsersToLikes: Map<string, string[]> =new Map<string, string[]>();
    mapIconToPost: Map<string, string> = new Map<string, string>();

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
        private homeService: HomeService,
        private profileService: ProfileService
    ) {}


    ngOnInit() { 
        const email = this.globalService.getCurrentUser();
        this.currentUserEmail = email;
        this.profileService.getUserByEmail(email).subscribe((user: User) => {
            this.currentUser = user;
            this.profileService.getProfileImage(email).subscribe((profileImage: string) => {
                this.currentUser.pictureURL = profileImage;
            })
        });
        
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

                this.profileService.getUserByEmail(comment.senderEmail).subscribe((user: User) => {
                    let newUser = user;
                    this.profileService.getProfileImage(comment.senderEmail).subscribe((pictureURL: string) => {
                        if(pictureURL === null) {
                            newUser.pictureURL = "assets/images/blank.jpg";
                        } else {
                            newUser.pictureURL = pictureURL;
                        }
                    
                    this.mapUserToComment.set(comment.commentId, newUser);
                    });
                });
            });

            this.commentSocket.on('delete-comment-broadcast', (commentId: string, postId: string) => {
                this.mapCommentsToPosts.set(postId, this.mapCommentsToPosts.get(postId).filter((comment: Comment) => comment.commentId !== commentId));
            });

            this.commentSocket.on('like-broadcast', (postId: string, userEmail: string) => {
                const likesArray: string[] = this.mapUsersToLikes.get(postId);
                likesArray.push(userEmail);
                this.mapUsersToLikes.set(postId, likesArray);
            });

            this.commentSocket.on('dislike-broadcast', (postId: string, userEmail: string) => {
                this.mapUsersToLikes.set(postId, this.mapUsersToLikes.get(postId).filter((email: string) => userEmail !== email));
                
                console.log(this.mapUsersToLikes.get(postId));
            });

            this.posts.forEach(post => {
                this.commentSocket.emit('setRoom', post.postId);
                this.mapNewCommentToPost.set(post.postId, '');

                this.homeService.getCommentsByPostId(post.postId).subscribe((comments: Comment[]) => {
                    this.mapCommentsToPosts.set(post.postId, comments);
                    
                    this.mapCommentsToPosts.get(post.postId).forEach(comment => {
                        this.profileService.getUserByEmail(comment.senderEmail).subscribe((user: User) => {
                            let newUser = user;
                            this.profileService.getProfileImage(comment.senderEmail).subscribe((pictureURL: string) => {
                                if(pictureURL === null) {
                                    newUser.pictureURL = "assets/images/blank.jpg";
                                } else {
                                    newUser.pictureURL = pictureURL;
                                }
                            
                            this.mapUserToComment.set(comment.commentId, newUser);
                            });
                        });
                    });

                    this.mapCommentsToPosts.set(post.postId, this.mapCommentsToPosts.get(post.postId).sort((comment1, comment2) => comment1.timestamp - comment2.timestamp));
                });

                this.homeService.getLikesByPostId(post.postId).subscribe((usersEmail: string[]) => {
                    this.mapUsersToLikes.set(post.postId, usersEmail);
                    
                    if(this.mapUsersToLikes.get(post.postId).lastIndexOf(this.currentUser.email) === -1) {
                        this.mapIconToPost.set(post.postId, "fa fa-thumbs-up");
                    }
                    else {
                        this.mapIconToPost.set(post.postId, "fa fa-thumbs-down");
                    }
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

    deleteComment(commentId: string, postId: string): void {
        this.commentSocket.emit('delete-comment', commentId, postId);
    }

    addLike(postId :string): void {
        if(this.mapUsersToLikes.get(postId).lastIndexOf(this.currentUser.email) === -1) {
            this.commentSocket.emit('like', postId, this.currentUser.email);
            this.mapIconToPost.set(postId, "fa fa-thumbs-down");
        }
        else {
            this.commentSocket.emit('dislike', postId, this.currentUser.email);
            this.mapIconToPost.set(postId, "fa fa-thumbs-up");
        }
    }
}