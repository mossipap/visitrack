import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemandeCompteComponent } from './demande-compte.component';

const routes: Routes = [
  {
    path : '',
    component : DemandeCompteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemandeCompteRoutingModule { }
