import { NgModule } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// components
import { NavbarComponent } from './navbar.component';

// services
import { GlobalService } from '../utils/global.service';
import { NavbarService } from '../navbar/navbar.service';

// interceptors
import { JwtInterceptor } from '../utils/interceptors/jwt.interceptor';
import { ErrorInterceptor } from '../utils/interceptors/error.interceptor';

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
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        GlobalService, 
        NavbarService
    ],
    bootstrap: []
})
export class NavbarModule {}