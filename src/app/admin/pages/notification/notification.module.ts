import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationComponent } from './notification.component';
import { TimeagoClock, TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from "ngx-timeago";
import { Observable, of } from "rxjs";
import { delay, expand, skip } from "rxjs/operators";
import { NgxLoadingModule } from 'ngx-loading';
export class MyClock extends TimeagoClock {
  tick(then: number): Observable<number> {
    return of(0)
    .pipe(
      expand(() => {
        const now = Date.now();
        const seconds = Math.round(Math.abs(now - then ) / 1000);
        const period = seconds < 60 ? 1000 : 1000 * 60;
        return of(period).pipe(delay(period));
      }),
      skip(1)
    )
  }
}
export class MyIntl extends TimeagoIntl {
  // do extra stuff here...
}
@NgModule({
  declarations: [
    NotificationComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    FormsModule,
    MaterialModule,
    NgxPaginationModule,
    FilterPipeModule,
    NgxLoadingModule,
    TimeagoModule.forRoot({
      clock: { provide: TimeagoClock, useClass: MyClock },
    }),
    TimeagoModule.forChild({
      intl: { provide: TimeagoIntl, useClass: MyIntl },
      formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
    })
  ]
})
export class NotificationModule { }
