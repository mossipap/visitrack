import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { TimeagoClock, TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from "ngx-timeago";
import { Observable, of } from "rxjs";
import { delay, expand, skip } from "rxjs/operators";
import { NgxLoadingModule } from 'ngx-loading';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxEditorModule } from 'ngx-editor';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ParametreRoutingModule } from '../parametre/parametre-routing.module';
import { VisiteurComponent } from './visiteur.component';
import { VisiteurRoutingModule } from './visiteur-routing.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SignatureComponent } from 'src/app/components/signature/signature.component';
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
    VisiteurComponent, SignatureComponent
  ],
  imports: [
    VisiteurRoutingModule,
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
export class VisiteurModule { }
