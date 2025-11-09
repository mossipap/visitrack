import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonProfileComponent } from './mon-profile.component';

const routes: Routes = [
  {
    path : '',
    component : MonProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonProfileRoutingModule { }
