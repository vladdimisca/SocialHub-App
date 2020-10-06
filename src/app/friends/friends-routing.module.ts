import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';
import { FriendsListComponent } from './friends-list/friends-list.component';

const routes: Routes = [
    {path: 'friend-requests', component: FriendRequestsComponent, data: {title: 'Friend Requests'}},
    {path: 'friends-list', component: FriendsListComponent, data: {title: 'Friends List'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FriendsRoutingModule { }
