import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { DemandeCompteRoutingModule } from './demande-compte-routing.module';
import { DemandeCompteComponent } from './demande-compte.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { FilterPipeModule } from 'ngx-filter-pipe';

@NgModule({
  declarations: [
    DemandeCompteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DemandeCompteRoutingModule,
    MaterialModule,
    FilterPipeModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.circle,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      primaryColour: '#40a83d',
      secondaryColour: '#54696aff',
      tertiaryColour: '#2e86b4',
      fullScreenBackdrop:true,
    }),
  
  ]
})
export class DemandeCompteModule { }
