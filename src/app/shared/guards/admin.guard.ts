import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router){}
 canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    //localStorage.setItem('current_demande_link_app', JSON.stringify(state.url));
    if (localStorage.getItem('current_session_visitrack')) {
      return true;
    }else{
      this.router.navigate(['/login']);
      return false;
    }
  }
 canActivate2(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Sauvegarde du lien actuel
    localStorage.setItem('current_link_visitrack', JSON.stringify(state.url));

    // Vérifie si l'utilisateur a une session active
    const session = localStorage.getItem('current_session_visitrack');
    
    if (session) {
      return true; // accès autorisé
    } else {
      // Redirection vers la page de login
      this.router.navigate(['/login']);
      return false;
    }
  }

}
