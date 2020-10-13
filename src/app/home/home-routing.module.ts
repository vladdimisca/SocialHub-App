import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { HomeComponent } from './home.component';

// guards
import { AuthGuard } from '../utils/guards/auth.guard';

const routes: Routes = [
  {
    path: '', 
    component: HomeComponent, 
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
