import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';

const routes: Routes = [
    {path: 'friend-requests', component: FriendRequestsComponent, data: {title: 'Friend Requests'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FriendsRoutingModule { }
