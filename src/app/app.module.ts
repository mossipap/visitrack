import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminModule } from './admin/admin.module';
import { LoginModule } from './login/login.module';
import { ToastrModule } from 'ngx-toastr';
import { AppConfig } from './shared/utils/app-config';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import localeFr from '@angular/common/locales/fr';
import { DemandeCompteModule } from './demande-compte/demande-compte.module';
registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AdminModule,
    LoginModule,
    DemandeCompteModule,
    ToastrModule.forRoot({
      timeOut: 6000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),
    /* AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBnw4yVuqf9E7uE75JyhxASyVCWdaFcheI'
    }) */
  ],
  providers: [
    AppConfig,
    DatePipe,
    TranslatePipe,
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
