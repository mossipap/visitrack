import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppToastService } from "../shared/utils/AppToast.service";
import { environment } from "src/environments/environment";
import { AuthService } from "../shared/services/auth.service";
import { AuthUser } from "../shared/models/auth-user";
import { UtilisateurService } from "../shared/services/utilisateur.service";
import { JwtHelperService } from '@auth0/angular-jwt';
import * as SecureLS from "secure-ls";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  public loading: boolean;
  public hidden: boolean = true;
  public isResetPwd: boolean = false;
  public isWhite: boolean = false;
  public authUser: AuthUser = new AuthUser();
  public helper = new JwtHelperService();

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UtilisateurService,
    private toast: AppToastService
  ) { }

  ngOnInit(): void {
   const session = localStorage.getItem('current_session_novus');
if (session) {
  // Si déjà connecté, on reste dans l’espace admin sans forcer dashboard
  this.router.navigate(['/admin']);
}
  }

connecter() {
  this.loading = true;
  this.authService.loginUser(this.authUser).subscribe((response: any) => {
    if (response.data) {
      if (!response.data.token) {
        this.toast.error(response.data);
        this.loading = false;
        return;
      }

      const token = response.data.token;
      localStorage.setItem('session', token);

      const decodedToken = this.helper.decodeToken(token);

      this.userService.findById(decodedToken.user_id).subscribe((ret: any) => {
        this.loading = false;

        if (ret['code'] === 200) {
          const ls = new SecureLS({
            encodingType: 'aes',
            encryptionSecret: 'MyAdminApp',
          });

          const userconnect = ret['data'];

          ls.set('current_theme', this.isWhite);
          ls.set('current_session_novus', JSON.stringify({ user: userconnect, droits: ret['droit_user'] }));

          // ✅ Redirection vers le tableau de bord après login
          this.router.navigate(['/dashboard']);
          this.toast.success(ret['message']);

        } else {
          this.toast.error(ret['message']);
        }
      }, () => {
        this.toast.error(environment.erreur_connexion_message);
        this.loading = false;
      });
    } else {
      this.toast.error(response['message']);
      this.loading = false;
    }
  }, () => {
    this.toast.error('Problème de connexion');
    this.loading = false;
  });
}



  toggleShow() {
    this.hidden = !this.hidden;
  }

  onChangeResetPwd() {
    this.isResetPwd = !this.isResetPwd;
  }
  setThemeWhite() {
    const menuLeft = document.getElementsByClassName("bg-cab-2");
    for(var i = menuLeft.length - 1; i >= 0; --i) {
      menuLeft[i].classList.replace('bg-cab-2', 'bg-cab-1');
    }
    const menuLeftColor = document.getElementsByClassName("c-cab-1");
    for(var i = menuLeftColor.length - 1; i >= 0; --i) {
      menuLeftColor[i].classList.replace('c-cab-1', 'c-cab-2');
    }
    const themeMap = document.getElementsByClassName("theme-dark");
    for(var i = themeMap.length - 1; i >= 0; --i) {
      themeMap[i].classList.replace('theme-dark', 'theme-light');
    }
    const themeChart = document.getElementsByClassName("theme-dark-login");
    for(var i = themeChart.length - 1; i >= 0; --i) {
      themeChart[i].classList.replace('theme-dark-login', 'theme-light-login');
    }
    const libMac = document.getElementsByClassName("c-white");
    for(var i = libMac.length - 1; i >= 0; --i) {
      libMac[i].classList.replace('c-white', 'c-black');
    }
    const libNoir = document.getElementsByClassName("c-blanc");
    for(var i = libNoir.length - 1; i >= 0; --i) {
      libNoir[i].classList.replace('c-blanc', 'c-noir');
    }
    const formInput = document.getElementsByClassName("form-control-d");
    for(var i = formInput.length - 1; i >= 0; --i) {
      formInput[i].classList.replace('form-control-d', 'form-control-w');
    }
    this.isWhite = false;
  }
  setThemeDark() {
    const menuLeft = document.getElementsByClassName("bg-cab-1");
    for(var i = menuLeft.length - 1; i >= 0; --i) {
      menuLeft[i].classList.replace('bg-cab-1', 'bg-cab-2');
    }
    const menuLeftColor = document.getElementsByClassName("c-cab-2");
    for(var i = menuLeftColor.length - 1; i >= 0; --i) {
      menuLeftColor[i].classList.replace('c-cab-2', 'c-cab-1');
    }
    const themeMap = document.getElementsByClassName("theme-light");
    for(var i = themeMap.length - 1; i >= 0; --i) {
      themeMap[i].classList.replace('theme-light', 'theme-dark');
    }
    const themeChart = document.getElementsByClassName("theme-light-login");
    for(var i = themeChart.length - 1; i >= 0; --i) {
      themeChart[i].classList.replace('theme-light-login', 'theme-dark-login');
    }
    const libMac = document.getElementsByClassName("c-black");
    for(var i = libMac.length - 1; i >= 0; --i) {
      libMac[i].classList.replace('c-black', 'c-white');
    }
    const libBlanc = document.getElementsByClassName("c-noir");
    for(var i = libBlanc.length - 1; i >= 0; --i) {
      libBlanc[i].classList.replace('c-noir', 'c-blanc');
    }
    const formInput = document.getElementsByClassName("form-control-w");
    for(var i = formInput.length - 1; i >= 0; --i) {
      formInput[i].classList.replace('form-control-w', 'form-control-d');
    }
    this.isWhite = true;
  }
  /*  google map*/
}
