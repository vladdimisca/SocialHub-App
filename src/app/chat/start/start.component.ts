import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss']
})
export class StartComponent {
    constructor(
        private router: Router
    ) {}

    @Input()
    uuid: string;

    ngOnChanges() {
        if(this.uuid !== '')
            this.router.navigate(['chat/' + this.uuid]);
    }
}