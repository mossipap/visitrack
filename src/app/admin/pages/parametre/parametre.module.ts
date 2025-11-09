import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametreRoutingModule } from './parametre-routing.module';
import { ParametreComponent } from './parametre.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { CabinetComponent } from './cabinet/cabinet.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxLoadingModule } from 'ngx-loading';
import { TypeuserComponent } from './typeuser/typeuser.component';
import { TuserDialogComponent } from './typeuser/tuser-dialog/tuser-dialog.component';
import { NgxEditorModule } from 'ngx-editor';
import { TranslateModule } from '@ngx-translate/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TimeagoClock, TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from "ngx-timeago";
import { Observable, of } from "rxjs";
import { delay, expand, skip } from "rxjs/operators";
import { ProfilComponent } from './profil/profil.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MenuParametreComponent } from './menu-parametre/menu-parametre.component';

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
    ParametreComponent,
    UtilisateurComponent,
    CabinetComponent,
    TypeuserComponent,
    TuserDialogComponent,
    MenuParametreComponent,
    ProfilComponent,
  ],
  imports: [
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
    TranslateModule.forChild(),
    TimeagoModule.forRoot({
      clock: { provide: TimeagoClock, useClass: MyClock },
    }),
    TimeagoModule.forChild({
      intl: { provide: TimeagoIntl, useClass: MyIntl },
      formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
    })
  ]
})
export class ParametreModule { }
