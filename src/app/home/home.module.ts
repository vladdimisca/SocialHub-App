// modules
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NavbarModule } from '../navbar/navbar.module';
import { HomeRoutingModule } from './home-routing.module';

// components
import {HomeComponent} from './home.component';

// services
import { GlobalService } from '../utils/global.service';
import { HomeService } from './home.service';

@NgModule({
  declarations: [
        HomeComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NavbarModule,
    HomeRoutingModule
  ],
  exports: [],
  providers: [GlobalService, HomeService],
  bootstrap: []
})
export class HomeModule { }
