import { NgModule } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// components
import { NavbarComponent } from './navbar.component';

// services
import { GlobalService } from '../utils/global.service';
import { NavbarService } from '../navbar/navbar.service';

@NgModule({
    declarations: [
        NavbarComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
    exports: [NavbarComponent],
    providers: [GlobalService, NavbarService],
    bootstrap: []
})
export class NavbarModule {}