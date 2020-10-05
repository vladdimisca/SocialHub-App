import { Component, Input } from '@angular/core';

// interfaces
import { Post } from '../models/post.interface';

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

    constructor(
        private profileService: ProfileService,
    ) {}
}