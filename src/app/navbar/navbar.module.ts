import { NgModule } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// components
import { NavbarComponent } from './navbar.component';

// services
import { GlobalService } from '../utils/global.service';

@NgModule({
    declarations: [
        NavbarComponent
    ],
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [NavbarComponent],
    providers: [GlobalService],
    bootstrap: []
})
export class NavbarModule {}