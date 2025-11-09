import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthUser } from 'src/app/shared/models/auth-user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AppToastService } from 'src/app/shared/utils/AppToast.service';
import { AppConfig } from 'src/app/shared/utils/app-config';
import { TranslateService } from '@ngx-translate/core';
import { SearchParam } from 'src/app/shared/utils/search-param';
import { environment } from 'src/environments/environment';
import { strings as englishStrings } from 'ngx-timeago/language-strings/en';
import { strings as englishShortStrings } from 'ngx-timeago/language-strings/en-short';
import { strings as frenchStrings } from 'ngx-timeago/language-strings/fr';
import { strings as frenchShortStrings } from 'ngx-timeago/language-strings/fr-short';
import { NotifyService } from 'src/app/shared/services/notification.service';
import { NotificationObjet } from 'src/app/shared/models/notification';
import { RoleManager } from 'src/app/shared/utils/role-manager';
import { timer } from 'rxjs';
import { TimeagoIntl } from 'ngx-timeago';
import * as SecureLS from 'secure-ls';
import { Utilisateur } from 'src/app/shared/models/utilisateur';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public authUser: AuthUser;
  public isDark: boolean;
  public isExpanded: boolean = true;
  public currentUser: Utilisateur;
  public currentDay: Date = new Date();
  public currentMenu: string;
  public menuTitle: string;
  public loading: boolean;
  public notifications: NotificationObjet[] = [];
  public criteriaList = [
    { id: 1, name: 'Dossiers en cours/clots/prescrit' },
    { id: 2, name: 'Dossiers en alertes' },
    { id: 3, name: 'Nombre total des inculpés' },
    { id: 4, name: 'Nombre total des inculpés sous MD' },
    { id: 5, name: 'Nombre total des inculpés sous MA' },
    { id: 6, name: 'Nombre total des inculpés sous CJ' },
    { id: 7, name: 'Types d\'infractions' },
  ];
  /*  time part */
  public clock: any;
  public date = new Date();
  public searchParam: SearchParam;
  public roleManager: RoleManager;
  public typeStatistiques: any[];
  public seconde:number | string = this.date.getSeconds();
  public minute:number | string = this.date.getMinutes();
  public heure:number | string = this.date.getHours();
  public defaultlanguages = ['fr', 'en'];
  public supportLanguages = [{libelle: 'FR', value: 'fr'}, {libelle: 'EN', value: 'en'}];
  public lang = 'fr-short';
  @ViewChild('openLogoutDialog') openLogoutDialog: any;
  @ViewChild('closeChangePaswDialog') closeChangePaswDialog: any;
  @ViewChild('closeStatisticsModal') closeStatisticsModal: any;

  constructor(
    private router: Router,
    private toast: AppToastService,
    private authService: AuthService,
    private notifyService: NotifyService,
    private translateService: TranslateService,
    private appConfig: AppConfig,
    private intl: TimeagoIntl) {
    this.currentUser = this.appConfig.currentUser;
    this.authUser = new AuthUser();
    this.searchParam = new SearchParam();
    this.roleManager = new RoleManager();
    this.translateService.addLangs(this.defaultlanguages);
    this.translateService.setDefaultLang('fr');
    this.setLang(this.lang);
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.currentMenu = val.url.split("/")[2];
        switch(this.currentMenu) {
          case 'dashboard':
            this.menuTitle = 'Tableau de bord';
          break;
          case 'visiteur':
            this.menuTitle = 'Gestion des visiteurs';
          break;
          case 'rendez-vous':
            this.menuTitle = 'Rendez-vous';
          break;
          case 'agent':
            this.menuTitle = 'Gestion du personnel';
          break;
          case 'rapport':
            this.menuTitle = 'Rapports et statistiques';
          break;
      
          case 'reclamations':
            this.menuTitle = 'Réclamations';
          break;
       
          case 'parametre':
            this.menuTitle = 'Paramètres';
          break;
          case 'notifications':
            this.menuTitle = 'Notifications';
          break;
          default:
            this.menuTitle = 'Tableau de bord';
          break;
        }
      }
    })
  }

  ngOnInit(): void {
    const counter = timer(0, 1000);
    counter.subscribe(() => {
      this.time();
    });
    const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: 'MyAdminApp' });
    if (ls.get('current_theme')) {//dark
      this.isDark = true;
      const theme = document.getElementsByClassName("theme-light");
      for(var i = theme.length - 1; i >= 0; --i) {
        theme[i].classList.replace('theme-light', 'theme-dark');
      }
      const headerLeft = document.getElementsByClassName("header-left-w");
      for(var i = headerLeft.length - 1; i >= 0; --i) {
        headerLeft[i].classList.replace('header-left-w', 'header-left-d');
      }
      const headerRight = document.getElementsByClassName("header-right-w");
      for(var i = headerRight.length - 1; i >= 0; --i) {
        headerRight[i].classList.replace('header-right-w', 'header-right-d');
      }
      const menuNotif = document.getElementsByClassName("c-black");
      for(var i = menuNotif.length - 1; i >= 0; --i) {
        menuNotif[i].classList.replace('c-black', 'c-white');
      }
      const libTimer = document.getElementsByClassName("time-white");
      for(var i = libTimer.length - 1; i >= 0; --i) {
        libTimer[i].classList.replace('time-white', 'time-black');
      }
      const libDate = document.getElementsByClassName("lib-date-w");
      for(var i = libDate.length - 1; i >= 0; --i) {
        libDate[i].classList.replace('lib-date-w', 'lib-date-d');
      }
      this.changeConfirmBg('#1c1c1c');
    } else {//white
      this.isDark = false;
      const theme = document.getElementsByClassName("theme-dark");
      for(var i = theme.length - 1; i >= 0; --i) {
        theme[i].classList.replace('theme-dark', 'theme-light');
      }
      const headerLeft = document.getElementsByClassName("header-left-d");
      for(var i = headerLeft.length - 1; i >= 0; --i) {
        headerLeft[i].classList.replace('header-left-d', 'header-left-w');
      }
      const headerRight = document.getElementsByClassName("header-right-w");
      for(var i = headerRight.length - 1; i >= 0; --i) {
        headerRight[i].classList.replace('header-right-d', 'header-right-w');
      }
      const menuNotif = document.getElementsByClassName("c-black");
      for(var i = menuNotif.length - 1; i >= 0; --i) {
        menuNotif[i].classList.replace('c-black', 'c-white');
      }
      const libTimer = document.getElementsByClassName("time-black");
      for(var i = libTimer.length - 1; i >= 0; --i) {
        libTimer[i].classList.replace('time-black', 'time-white');
      }
      const libDate = document.getElementsByClassName("lib-date-d");
      for(var i = libDate.length - 1; i >= 0; --i) {
        libDate[i].classList.replace('lib-date-d', 'lib-date-w');
      }
      this.changeConfirmBg("#ffffff")
    }
    this.searchParam.dateFin.setDate(this.searchParam.dateFin.getDate() + 1);
    if(this.currentUser.type_user_id === 3 || this.currentUser.type_user_id === 4) {
      this.InitNotifications();
    }
  }
  selectLang(lang: string) {
    this.translateService.use(lang);
  }
  setLang(lang: string) {
    this.lang = lang;
    switch (lang) {
      case 'en': this.intl.strings = englishStrings; break;
      case 'en-short': this.intl.strings = englishShortStrings; break;
      case 'fr': this.intl.strings = frenchStrings; break;
      case 'fr-short': this.intl.strings = frenchShortStrings; break;
      default: break;
    }
    this.intl.changes.next();
  }

  time() {
    let date = new Date();
    let second:number | string = date.getSeconds();
    let minute:number | string = date.getMinutes();
    let hour:number | string = date.getHours();
    if (second < 10) {
      second = '0' + second
    }
    if (minute < 10) {
      minute = '0' + minute;
    }
    if (hour < 10) {
      hour = '0' + hour;
    }
    this.seconde = second;
    this.heure = hour;
    this.minute = minute;
    this.clock = hour + ":" + minute + ":" + second;
  }
  changeConfirmBg(newValue: string): void {
    document.documentElement.style.setProperty('--confirm-bg', newValue);
  }

  showLogoutDialog() {
    this.openLogoutDialog.nativeElement.click();
  }

  showChangePwd() {
    this.authUser.id = this.currentUser.id;
    this.authUser.userId = this.currentUser.id;
  }

  public logout() {
    localStorage.removeItem('current_session_novus');
    localStorage.removeItem('current_theme');
    this.openLogoutDialog.nativeElement.click();
    this.router.navigate(['/login']);
  }

  goToOrganigram() {
    this.router.navigate(['/organigramme']);
  }

  changerPwd(): void {
    if(this.authUser.newPassword.length <= 0 || this.authUser.oldPassword.length <= 0 ){
      this.toast.warning("Tous les champs sont obligatoire");
      return;
    }
    if(this.authUser.newPassword.length < 5 ){
      this.toast.warning("Le nouveau mot de passe doit être supérieur à 5 caractères");
      return;
    }
    if(this.authUser.newPassword !== this.authUser.confirmPassword){
      this.toast.warning("Veuillez confirmez votre mot de passe");
      return;
    }
    this.authUser.password = this.authUser.newPassword;
    this.loading = true;
    this.authService.changePassword(this.authUser).subscribe(ret => {
      if (ret['code'] === 200) {
        localStorage.removeItem('current_session_novus');
        localStorage.removeItem('current_theme');
        this.router.navigate(['/login']);
        this.toast.success(ret['message']);
        this.closeChangePaswDialog.nativeElement.click();
      } else {
        this.toast.error(ret['message']);
      }
      this.loading = false;
    }, error => {
      console.log("error====>", error);
      this.loading = false;
      this.toast.error('Une erreur est survenue lors de l\'opération');
    });
  }

  InitNotifications() {
    this.notifyService.findByEventUser(this.currentUser.id).subscribe(ret => {
      if (ret['code'] === 200) {
        const events = ret['data'];
        const notifs = ret['Notification'];
        this.notifications = events.concat(notifs);
        this.loading = false;
      } else {
        this.loading = false;
        this.toast.error(ret['message']);
      }
    }, error => {
      console.log("error===>", error);
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
    });
  }

  setNotifyVue(notification: NotificationObjet) {
    notification.statut = 'Vue';
    this.notifyService.updateStatut(notification).subscribe(ret => {
      if (ret['code'] === 200) {
        const notifRet = ret['data'];
        this.notifications.forEach(element => {
          if(element.id === notifRet.id) {
            element.statut = notifRet.statut;
          }
        });
        if(notifRet.sujet === 'Ordonnance') {
          switch(this.currentUser.type_user_id) {
            case 1:
              this.router.navigate(['/admin/secretariat/assistante']);
            break;
            case 2:
              this.router.navigate(['/admin/secretariat/presidente']);
            break;
            case 3:
              this.router.navigate(['/admin/juge/instruction']);
            break;
            case 4:
              this.router.navigate(['/admin/juge/greffier']);
            break;
            case 5:
              this.router.navigate(['/admin/secretariat/vice-presidente']);
            break;
          }
        } else {
          this.router.navigate(['/admin/calendriers']);
        }
        this.loading = false;
      } else {
        this.loading = false;
        this.toast.error(ret['message']);
      }
    }, error => {
      console.log("error===>", error);
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
    });
  }

  genereStatic() {
    this.closeStatisticsModal.nativeElement.click();
    const serializedObject = encodeURIComponent(JSON.stringify(this.typeStatistiques));
    this.router.navigate(['/admin/statistique'], { queryParams: { dataStatistique: serializedObject } });
  }

  /* **********collapsed************ */
  /* ---------------collapse sidebar-------------- */
  openSidebar() {
    var sidebbar = document.getElementById("sidebar");
    sidebbar.style.width = "0%";
  }
  onCollapseSidebar() {
    if (this.isExpanded) {
      this.isExpanded = false;
    } else {
      this.isExpanded = true;
    }
    var sidebar = document.getElementById('sidebar');
    var mainContent = document.getElementById('main-content');
    var footer = document.getElementById('footer');
    var version = document.getElementById('cabversion');
    if (this.isExpanded) {
      sidebar.classList.remove('sidebar');
      sidebar.classList.add('sidebar');
      sidebar.style.width = "200px";
      mainContent.classList.remove('main-collapsed');
      mainContent.classList.add('main-expanded');
      version.style.visibility = "visible";
      return;
    }
    mainContent.classList.add('main-collapsed');
    mainContent.classList.remove('main-expanded');
    sidebar.style.width = "43px";
    sidebar.classList.remove('sidebar');
    sidebar.classList.add('sidebar', 'collapsed');
    version.style.visibility = "hidden";
    footer.style.marginLeft = "0px"
  }
  /* ====================changer le theme================= */
  onChangeTheme() {
    this.isDark= !this.isDark;
    if(this.isDark) {//dark
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
    } else {//white
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
    }
    const ls = new SecureLS({
      encodingType: "aes",
      encryptionSecret: "MyAdminApp",
    });
    ls.set("current_theme", this.isDark);
    window.location.reload();
  }
  setThemeDark() {
    this.isDark = true;
    const ls = new SecureLS({
      encodingType: "aes",
      encryptionSecret: "MyAdminApp",
    });
    ls.set("current_theme", this.isDark);
    window.location.reload();
  }
  
}
