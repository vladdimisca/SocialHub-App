// modules
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthenticationRoutingModule } from './auth-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavbarModule } from '../navbar/navbar.module';

// components
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AboutComponent } from './about/about.component';

// services
import { AuthenticationService } from './authentication.service';
import { GlobalService } from '../utils/global.service';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AboutComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    HttpClientModule,
    FormsModule,
    NavbarModule
  ],
  exports: [],
  providers: [AuthenticationService, GlobalService],
  bootstrap: []
})
export class AuthenticationModule { }
