import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonProfileRoutingModule } from './mon-profile-routing.module';
import { MonProfileComponent } from './mon-profile.component';
import { FormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';


@NgModule({
  declarations: [
    MonProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MonProfileRoutingModule,
    NgxLoadingModule,
  ]
})
export class MonProfileModule { }
