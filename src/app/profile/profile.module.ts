import { NgModule } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { NavbarModule } from '../navbar/navbar.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// components
import { UserProfileComponent } from './user-profile/user-profile.component';
import { GalleryComponent } from './gallery/gallery.component';
import { DetailsComponent } from './details/details.component';
import { UploadPhotoComponent } from './upload-photo/upload-photo.component';
import { SettingsComponent } from './settings/settings.component';

// services
import { GlobalService } from '../utils/global.service';
import { ProfileService } from './profile.service';

// interceptors
import { JwtInterceptor } from '../utils/interceptors/jwt.interceptor';
import { ErrorInterceptor } from '../utils/interceptors/error.interceptor';

@NgModule({
    declarations: [
        UserProfileComponent,
        GalleryComponent,
        DetailsComponent,
        UploadPhotoComponent,
        SettingsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ProfileRoutingModule,
        NavbarModule,
        HttpClientModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        GlobalService,
        ProfileService, 
        JwtInterceptor
    ],
    bootstrap: []
})
export class ProfileModule {}