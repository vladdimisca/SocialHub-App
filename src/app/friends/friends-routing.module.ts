import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';
import { FriendsListComponent } from './friends-list/friends-list.component';

// guards
import { AuthGuard } from '../utils/guards/auth.guard';

const routes: Routes = [
    {
      path: 'friend-requests', 
      component: FriendRequestsComponent, 
      canActivate: [AuthGuard],
      data: {title: 'Friend Requests'}
    },
    {
      path: 'friends-list', 
      component: FriendsListComponent, 
      canActivate: [AuthGuard],
      data: {title: 'Friends List'}
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FriendsRoutingModule { }
