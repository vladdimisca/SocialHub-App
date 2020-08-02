// modules
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';

// components
import { AppComponent } from './app.component';

// services
import { GlobalService } from './utils/global.service';

@NgModule({
  declarations: [
    AppComponent 
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [Title, GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
