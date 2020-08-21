import { Component } from '@angular/core';

@Component({
    selector: 'app-inbox',
    templateUrl: './inbox.component.html',
    styleUrls: ['./inbox.component.scss']
})
export class InboxComponent {
    uuid: string = '';

    openConversation(event: string) {
        this.uuid = event;
    }
}