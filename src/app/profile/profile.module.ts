import { NgModule } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { NavbarModule } from '../navbar/navbar.module';

// components
import { UserProfileComponent } from './user-profile/user-profile.component';

// services
import { GlobalService } from '../utils/global.service';

@NgModule({
    declarations: [
        UserProfileComponent
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        NavbarModule
    ],
    providers: [GlobalService],
    bootstrap: []
})
export class ProfileModule {}