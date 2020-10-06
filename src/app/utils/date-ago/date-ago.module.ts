import { NgModule } from '@angular/core';

// modules
import { CommonModule, DatePipe } from '@angular/common'

// pipes
import { DateAgoPipe } from '../date-ago/date-ago.pipe';

@NgModule({
    declarations: [
      DateAgoPipe 
    ],
    imports: [
      CommonModule,
    ],
    providers: [DatePipe],
    bootstrap: [],
    exports: [DateAgoPipe]
})
export class DateAgoModule { }
  