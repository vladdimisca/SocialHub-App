import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { ConversationComponent } from './conversation/conversation.component';

// guards
import { AuthGuard } from '../utils/guards/auth.guard';

const routes: Routes = [
    {
      path: ':conversation', 
      component: ConversationComponent,
      canActivate: [AuthGuard], 
      data: {title: 'Conversation'}
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
