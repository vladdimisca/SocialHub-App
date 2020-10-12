import { Component, Input } from '@angular/core';

// interfaces
import { Post } from '../../models/post.interface';

// services
import { ProfileService } from '../profile.service';

@Component({
    selector: 'app-gallery',
    templateUrl: 'gallery.component.html',
    styleUrls: ['gallery.component.scss']
})
export class GalleryComponent {
    @Input() 
    posts: Post[] = [];

    overlay: boolean = false;
    displayedPost: Post;

    constructor(
        private profileService: ProfileService,
    ) {}

    startOverlay(post: Post): void {
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        this.overlay = true;
        this.displayedPost = post;
    }

    stopOverlay(): void {
        this.overlay = false;
        document.getElementsByTagName('body')[0].style.overflow = 'auto';
    }
}