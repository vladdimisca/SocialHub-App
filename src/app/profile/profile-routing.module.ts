import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UploadPhotoComponent } from './upload-photo/upload-photo.component'; 
import { SettingsComponent } from './settings/settings.component';

// guards
import { AuthGuard } from '../utils/guards/auth.guard';

const routes: Routes = [
    {
      path: 'upload-photo', 
      component: UploadPhotoComponent, 
      canActivate: [AuthGuard],
      data:{title: 'Upload Photo'}
    },
    {
      path: 'settings', 
      component: SettingsComponent,
      canActivate: [AuthGuard], 
      data:{title: 'Settings'}
    },
    {
      path: ':user', 
      component: UserProfileComponent,
      canActivate: [AuthGuard], 
      data: {title: 'Profile'}
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
