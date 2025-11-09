import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminGuard } from '../shared/guards/admin.guard';
import { LoginComponent } from '../login/login.component';
import { DemandeCompteComponent } from '../demande-compte/demande-compte.component';

const routes: Routes = [
  // 🔐 Page de connexion publique
  //{ path: 'login', component: LoginComponent },
  { path: 'demande-compte', component: DemandeCompteComponent },

  // 🧭 Zone protégée par le guard
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      // Redirection par défaut vers le dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./pages/notification/notification.module').then((m) => m.NotificationModule),
      },
      {
        path: 'rendez-vous',
        loadChildren: () =>
          import('./pages/rendezvous/rendezvous.module').then((m) => m.RendezvousModule),
      },
      {
        path: 'visiteur',
        loadChildren: () =>
          import('./pages/visiteur/visiteur.module').then((m) => m.VisiteurModule),
      },
      {
        path: 'rapport',
        loadChildren: () =>
          import('./pages/rapport/rapport.module').then((m) => m.RapportModule),
      },
      {
        path: 'reclamation',
        loadChildren: () =>
          import('./pages/reclamation/reclamation.module').then((m) => m.ReclamationModule),
      },
      {
        path: 'parametre',
        loadChildren: () =>
          import('./pages/parametre/parametre.module').then((m) => m.ParametreModule),
      },
      {
        path: 'mon-profil',
        loadChildren: () =>
          import('./pages/mon-profile/mon-profile.module').then((m) => m.MonProfileModule),
      },
    ],
  },

  // 🔁 Redirection si aucune route ne correspond
  { path: '**', redirectTo: 'login' },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
