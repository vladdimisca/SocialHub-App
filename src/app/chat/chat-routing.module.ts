import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { InboxComponent } from './inbox/inbox.component';
import { ConversationComponent } from './conversation/conversation.component';

const routes: Routes = [
    {path: 'inbox', component: InboxComponent, data: {title: 'Inbox'}},
    {path: 'conversation', component: ConversationComponent, data: {title: 'Conversation'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
