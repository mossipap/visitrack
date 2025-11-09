import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { RendezvousComponent } from './rendezvous.component';
import { TimeagoClock, TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from "ngx-timeago";
import { Observable, of } from "rxjs";
import { delay, expand, skip } from "rxjs/operators";
import { NgxLoadingModule } from 'ngx-loading';
import { RendezvousRoutingModule } from './rendezvous-routing.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxEditorModule } from 'ngx-editor';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ParametreRoutingModule } from '../parametre/parametre-routing.module';
import { RadioButtonModule } from 'primeng/radiobutton';

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
    RendezvousComponent
  ],
  imports: [
    RendezvousRoutingModule,
   CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      ParametreRoutingModule,
      NgxPaginationModule,
      FilterPipeModule,
      PdfViewerModule,
      NgxLoadingModule,
      NgxEditorModule,
      MatStepperModule,
      MatDividerModule,
      TableModule,
      TabViewModule,
      MultiSelectModule,
      DropdownModule,
      CalendarModule,
      RadioButtonModule,
     // TranslateModule.forChild(),
      TimeagoModule.forRoot({
        clock: { provide: TimeagoClock, useClass: MyClock },
      }),
      TimeagoModule.forChild({
        intl: { provide: TimeagoIntl, useClass: MyIntl },
        formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
      })
  ]
})
export class RendezvousModule { }
