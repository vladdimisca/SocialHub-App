import { NgModule } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { NavbarModule } from '../navbar/navbar.module';
import { HttpClientModule } from '@angular/common/http';

// components
import { UserProfileComponent } from './user-profile/user-profile.component';
import { GalleryComponent } from './gallery/gallery.component';
import { DetailsComponent } from './details/details.component';

// services
import { GlobalService } from '../utils/global.service';
import { ProfileService } from './profile.service';

@NgModule({
    declarations: [
        UserProfileComponent,
        GalleryComponent,
        DetailsComponent
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        NavbarModule,
        HttpClientModule
    ],
    providers: [GlobalService, ProfileService],
    bootstrap: []
})
export class ProfileModule {}