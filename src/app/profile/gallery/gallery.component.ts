import { Component, OnInit, Input } from '@angular/core';

import * as io from 'socket.io-client';

// interfaces
import { Post } from '../../models/post.interface';
import { User } from '../../models/user.interface';
import { Comment } from '../../models/comment.interface';

// services
import { GlobalService } from '../../utils/global.service';
import { ProfileService } from '../profile.service';
import { ActivatedRoute, Params } from '@angular/router';

const COMMENT_SOCKET_ENDPOINT = 'localhost:3000/comment';

@Component({
    selector: 'app-gallery',
    templateUrl: 'gallery.component.html',
    styleUrls: ['gallery.component.scss']
})

export class GalleryComponent implements OnInit  {
    @Input() 
    posts: Post[] = [];

    private commentSocket: io;

    currentUserEmail: string;
    currentUser: User;

    overlay: boolean = false;
    displayedPost: Post;

    displayedUser: User;

    comments: Comment[]; 
    newComment: string;
    likes: string[];
    mapUserToComment: Map<String, User> = new Map<String, User>();
    icon: string;

    constructor(
        private route: ActivatedRoute,
        private profileService: ProfileService,
        private globalService: GlobalService
    ) {}

    startOverlay(post: Post): void {
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        this.overlay = true;
        this.displayedPost = post;

        this.commentSocket.emit('setRoom', post.postId);
       
        this.newComment = '';

        this.profileService.getCommentsByPostId(post.postId).subscribe((comments: Comment[]) => {
            this.comments = comments;
            
            this.comments.forEach(comment => {
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

            comments.sort((comment1, comment2) => comment1.timestamp - comment2.timestamp);
        });

        this.profileService.getLikesByPostId(post.postId).subscribe((usersEmail: string[]) => {
            this.likes = usersEmail;
            
            if(this.likes.lastIndexOf(this.currentUser.email) === -1) {
                this.icon = "fa fa-thumbs-up";
            }
            else {
                this.icon = "fa fa-thumbs-down";
            }
        });
    }

    stopOverlay(event: any): void {
        if(event.target.id !== 'overlay'){
            return;
        }
        this.overlay = false;
        document.getElementsByTagName('body')[0].style.overflow = 'auto';
    }

    ngOnInit() {
        this.currentUserEmail = this.globalService.getCurrentUser();
        this.profileService.getUserByEmail(this.currentUserEmail).subscribe((user: User) => {
            this.currentUser = user;
            this.profileService.getProfileImage(this.currentUserEmail).subscribe((profileImage: string) => {
                this.currentUser.pictureURL = profileImage;
            })
        });

        this.route.params.subscribe((data: Params) => {
            if(this.commentSocket !== undefined) {
                this.commentSocket.close();
            }

            this.commentSocket = io(COMMENT_SOCKET_ENDPOINT);

             // broadcast comment
            this.commentSocket.on('comment-broadcast', (comment: Comment) => {
                const commentsArray: Comment[] = this.comments;
                commentsArray.push(comment);
                this.comments = commentsArray;

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
                this.comments = this.comments.filter((comment: Comment) => comment.commentId !== commentId);
            });   

            this.commentSocket.on('like-broadcast', (postId: string, userEmail: string) => {
                const likesArray: string[] = this.likes;
                likesArray.push(userEmail);
                this.likes = likesArray;
            });

            this.commentSocket.on('dislike-broadcast', (postId: string, userEmail: string) => {
                this.likes = this.likes.filter((email: string) => userEmail !== email);
            });

            this.profileService.getUserByEmail(data.user).subscribe((user: User) => {
                this.displayedUser = user;
                
                
                this.profileService.getProfileImage(data.user).subscribe((pictureURL: string) => {
                    if(pictureURL === null) {
                        this.displayedUser.pictureURL = "assets/images/blank.jpg";
                    } else {
                        this.displayedUser.pictureURL = pictureURL;
                    }
                });
            
            });

            this.posts.forEach(post => {
                this.commentSocket.emit('setRoom', post.postId);
                
                this.newComment = '';
                this.profileService.getCommentsByPostId(post.postId).subscribe((comments: Comment[]) => {
                    this.comments = comments;
                    
                    this.comments.forEach(comment => {
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
        
                    this.comments.sort((comment1, comment2) => comment1.timestamp - comment2.timestamp);
                });
            });

        });

    }

    addComment(event: any, postId: string): void {
        if(!this.newComment.replace(/\s/g, '').length) {
            this.newComment = '';
            return;
        }
        

        if(event instanceof KeyboardEvent) {
            this.newComment.slice(0, -1);
        } 

        const date = new Date();
        const timestamp = date.getTime();

        const email = this.globalService.getCurrentUser();
        const comment: Comment = {
            commentId: undefined,
            postId: postId,
            senderEmail: email,
            text: this.newComment,
            timestamp: timestamp
        }

        this.commentSocket.emit('comment', comment);
        this.newComment = '';
    }

    deleteComment(commentId: string, postId: string): void {
        this.commentSocket.emit('delete-comment', commentId, postId);
    }

    addLike(postId :string): void {
        if(this.likes.lastIndexOf(this.currentUser.email) === -1) {
            this.commentSocket.emit('like', postId, this.currentUser.email);
            this.icon = "fa fa-thumbs-down";
        }
        else {
            this.commentSocket.emit('dislike', postId, this.currentUser.email);
            this.icon = "fa fa-thumbs-up";
        }
    }
}