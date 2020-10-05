import { NgModule } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

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
        FormsModule,
        AutocompleteLibModule
    ],
    exports: [NavbarComponent],
    providers: [GlobalService, NavbarService],
    bootstrap: []
})
export class NavbarModule {}