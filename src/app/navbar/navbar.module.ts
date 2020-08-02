import { NgModule } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// components
import { NavbarComponent } from './navbar.component';

@NgModule({
    declarations: [
        NavbarComponent
    ],
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [NavbarComponent],
    providers: [],
    bootstrap: []
})
export class NavbarModule {}