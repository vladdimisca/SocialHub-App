import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// interfaces
import { User } from '../models/user.interface';

// services
import { GlobalService } from '../../utils/global.service';
import { ProfileService } from '../profile.service';

@Component({
    selector: 'app-upload-photo',
    templateUrl: 'upload-photo.component.html',
    styleUrls: ['upload-photo.component.scss']
})
export class UploadPhotoComponent implements OnInit { 
    profilePictureURL: string;
    descriptionText: string = '';
    uploadedImageURL: any = '';
    uploadTimestamp: number;

    currentUser: User = {
        uuid: '',
        email: '',
        firstName: '',
        lastName: ''
    }

    constructor(
        private profileService: ProfileService,
        private globalService: GlobalService,
        private router: Router
    ) {}

    ngOnInit() {
        const email = this.globalService.getCurrentUser();

        this.profileService.getProfileImage(email).subscribe((pictureURL: string) => {
            if(pictureURL === null) {
                this.profilePictureURL = "assets/images/blank.jpg";
            } else {
                this.profilePictureURL = pictureURL;
            }
        });

        this.profileService.getUserByEmail(email).subscribe((user: User) => {
            this.currentUser = user;
        });
    }

    uploadPhoto(event: any): void {
        if(event.target.files[0]['type'].split('/')[0] !== 'image') {
            return;
        }

        let file = event.target.files[0];
        let reader = new FileReader();

        reader.onloadend = () => {
            const date = new Date();

            this.uploadTimestamp = date.getTime();
            this.uploadedImageURL = reader.result;

            if(this.uploadedImageURL === '') {
                return;
            }
        }; 

        reader.readAsDataURL(file);
    }

    post(): void {
        this.profileService.uploadPhoto(this.currentUser.email, this.descriptionText, this.uploadedImageURL, this.uploadTimestamp)
            .subscribe(() => {
                this.router.navigateByUrl('profile/' + this.currentUser.email);
            });
    }
}