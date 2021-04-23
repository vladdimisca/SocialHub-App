// modules
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavbarModule } from '../navbar/navbar.module';
import { HomeRoutingModule } from './home-routing.module';
import { FormsModule } from '@angular/forms';

// pipes
import { DateAgoModule } from '../utils/date-ago/date-ago.module';

// components
import { HomeComponent } from './home.component';

// services
import { GlobalService } from '../utils/global.service';
import { HomeService } from './home.service';
import { ProfileService } from '../profile/profile.service'

// interceptors
import { JwtInterceptor } from '../utils/interceptors/jwt.interceptor';
import { ErrorInterceptor } from '../utils/interceptors/error.interceptor';
import { from } from 'rxjs';

@NgModule({
  declarations: [
        HomeComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NavbarModule,
    HomeRoutingModule,
    DateAgoModule,
    FormsModule
  ],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    GlobalService, 
    HomeService,
    ProfileService
  ],
  bootstrap: []
})
export class HomeModule { }
