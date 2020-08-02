import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { InboxComponent } from './inbox/inbox.component';

const routes: Routes = [
    {path: 'inbox', component: InboxComponent, data: {title: 'Inbox'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
