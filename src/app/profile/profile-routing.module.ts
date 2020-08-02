import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
    {path: ':user', component: UserProfileComponent, data: {title: 'Profile'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
