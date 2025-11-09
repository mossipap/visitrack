import { Injectable, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { NgxLoadingModule } from 'ngx-loading';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MaterialModule } from '../shared/modules/material.module';
import { TimeagoClock, TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';
import { Observable, of } from 'rxjs';
import { expand, delay, skip } from 'rxjs/operators';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
export class MyClock extends TimeagoClock {
  tick(then: number): Observable<number> {
    return of(0)
      .pipe(
        expand(() => {
          const now = Date.now();
          const seconds = Math.round(Math.abs(now - then) / 1000);
          const period = seconds < 60 ? 1000 : 1000 * 60;
          return of(period).pipe(delay(period));
        }),
        skip(1)
      );
  }
}
@Injectable()
export class MyIntl extends TimeagoIntl {
  // do extra stuff here...
}
@NgModule({
  declarations: [
    AdminComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    NgxLoadingModule,
    HttpClientModule,
    MaterialModule,
    MultiSelectModule,
    DropdownModule,
    CalendarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient)=> {return new TranslateHttpLoader(http, './assets/i18n/', '.json')},
        deps: [HttpClient]
      }
    }),
    TimeagoModule.forRoot({
      clock: { provide: TimeagoClock, useClass: MyClock },
    }),
    TimeagoModule.forChild({
      intl: { provide: TimeagoIntl, useClass: MyIntl },
      formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter }
    })
  ]
})
export class AdminModule { }
