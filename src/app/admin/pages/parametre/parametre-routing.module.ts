import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParametreComponent } from './parametre.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { CabinetComponent } from './cabinet/cabinet.component';
import { TypeuserComponent } from './typeuser/typeuser.component';
import { ProfilComponent } from './profil/profil.component';
import { MenuParametreComponent } from './menu-parametre/menu-parametre.component';

const routes: Routes = [
  {
    path : '',
    component : ParametreComponent,
    children: [
       {
        path: '',
        component: MenuParametreComponent,
      },
      {
        path: 'utilisateur',
        component: UtilisateurComponent
      },
      {
        path: 'profil',
        component: ProfilComponent
      },
  
      {
        path: 'cabinet',
        component: CabinetComponent
      },
      {
        path: 'agent',
        component: TypeuserComponent
      },
  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametreRoutingModule { }
