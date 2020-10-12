import { Component, OnInit } from '@angular/core';

// interfaces
import { Post } from '../../models/post.interface';

// services
import { ProfileService } from '../profile.service';
import { GlobalService } from 'src/app/utils/global.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-user-profile',
    templateUrl: 'user-profile.component.html',
    styleUrls: ['user-profile.component.scss']
})
export class UserProfileComponent implements OnInit { 
    displayedUser: string;
    posts: Post[] = [];

    constructor(
        private profileService: ProfileService,
        private globalService: GlobalService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.params.subscribe((data: Params) => {
            this.displayedUser = data.user;

            this.profileService.getPostsByEmail(this.displayedUser).subscribe((posts: Post[]) => {
                this.posts = posts;
            });
        });   
    }
}