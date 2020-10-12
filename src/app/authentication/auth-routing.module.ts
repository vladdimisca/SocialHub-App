import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

// guards
import { LoggedGuard } from '../utils/guards/logged.guard';

const routes: Routes = [
  {
    path: '', 
    component: LoginComponent,
    canActivate: [LoggedGuard]
  },
  {
    path: 'register', 
    component: RegisterComponent,
    canActivate: [LoggedGuard], 
    data: {title: 'Register'} 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
