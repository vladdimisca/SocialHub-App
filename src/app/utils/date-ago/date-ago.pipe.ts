import { AsyncPipe, DatePipe } from '@angular/common';
import { Pipe, ChangeDetectorRef } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Pipe({
    name: 'dateAgo',
    pure: false,
})
export class DateAgoPipe extends AsyncPipe {
    value: number;
    timer: Observable<string>;

    constructor(
        private ref: ChangeDetectorRef,
        private datePipe: DatePipe
    ) {
        super(ref);
    }
 
    transform(value: any, args?: any[]): any {
        if (value) {
            this.value = value;

            if(!this.timer) {
                this.timer = this.getObservable();
            }

            return super.transform(this.timer);
        }
        return super.transform(value);
    }

    private getObservable() {
        return interval(5000).pipe(startWith(0)).pipe(map(()=>
        {
            var result: string;
            // current time
            let now = new Date().getTime();

            // time since message was sent in seconds
            let delta = (now - this.value) / 1000;

            // format string
            if (delta < 45) {
                result = 'Just now';
            } else 
                if (delta < 60) { // sent in last minute
                result = Math.floor(delta) + ' seconds ago';
                } else 
                    if (delta < 3600) { // sent in last hour
                        if(Math.floor(delta / 60) === 1) {
                            result = Math.floor(delta / 60) + ' minute ago';
                        } else {
                            result = Math.floor(delta / 60) + ' minutes ago';
                        }
                    } else
                        if (delta < 86400) { // sent on last day
                            if(Math.floor(delta / 3600) === 1) {
                                result = Math.floor(delta / 3600) + ' hour ago';
                            } else {
                                result = Math.floor(delta / 3600) + ' hours ago';
                            }
                        } else 
                            if (delta < 3 * 86400) { // sent on last 3 days
                                    result = Math.floor(delta / 86400) + ' days ago';
                            } else { // sent more than three days ago
                                result = this.datePipe.transform(this.value, 'MMMM d, y h:mm a');
                            }
            return result;
        }));
    }
}