import { Component, OnInit } from '@angular/core';
import { TimeagoIntl } from 'ngx-timeago';
import { NotificationObjet } from 'src/app/shared/models/notification';
import { NotifyService } from 'src/app/shared/services/notification.service';
import { AppToastService } from 'src/app/shared/utils/AppToast.service';
import { strings as englishStrings } from 'ngx-timeago/language-strings/en';
import { strings as englishShortStrings } from 'ngx-timeago/language-strings/en-short';
import { strings as frenchStrings } from 'ngx-timeago/language-strings/fr';
import { strings as frenchShortStrings } from 'ngx-timeago/language-strings/fr-short';
import { environment } from 'src/environments/environment';
import { AppConfig } from 'src/app/shared/utils/app-config';
import { PaginationInstance } from 'ngx-pagination';
import * as SecureLS from 'secure-ls';
import { Utilisateur } from 'src/app/shared/models/utilisateur';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  public loading: boolean;
  public isDark: boolean;
  public currentUser: Utilisateur;
  public notifications1: NotificationObjet[] = [];
  public notifications: any[] = [];
  public live = true;
  public lang = 'fr-short';
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 5,
    currentPage: 1
  };
  public labels: any = {
    previousLabel: 'Préc',
    nextLabel: 'Suiv',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };
  constructor(
    private toast: AppToastService,
    private notifyService: NotifyService,
    private intl: TimeagoIntl,
    private appConfig: AppConfig) {
    this.currentUser = this.appConfig.currentUser;
  }

  ngOnInit(): void {
    const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: 'MyAdminApp' });
    if (ls.get('current_theme')) {//dark
      this.isDark = true;
      const headerLeft = document.getElementsByClassName("theme-light");
      for(var i = headerLeft.length - 1; i >= 0; --i) {
        headerLeft[i].classList.replace('theme-light', 'theme-dark');
      }
    } else {//white
      this.isDark = false;
      const headerLeft = document.getElementsByClassName("theme-dark");
      for(var i = headerLeft.length - 1; i >= 0; --i) {
        headerLeft[i].classList.replace('theme-dark', 'theme-light');
      }
    }
    this.InitNotifications();
     this.notifications = [
    {
      title: 'Nouvel utilisateur inscrit',
      message: 'Mr Coulibaly vient de créer un compte sur la plateforme.',
      time: 'Il y a 5 minutes',
      icon: 'mdi-account-plus',
      type: 'success',
      read: false
    },
    {
      title: 'Demande en attente',
      message: 'Une nouvelle demande doit être validée.',
      time: 'Il y a 1 heure',
      icon: 'mdi-clock-outline',
      type: 'warning',
      read: false
    },
    {
      title: 'Erreur de synchronisation',
      message: 'Le serveur n’a pas pu se connecter à la base de données.',
      time: 'Hier',
      icon: 'mdi-alert-circle-outline',
      type: 'danger',
      read: true
    }
  ];


  }

  onPageChange(number: number) {
    this.config.currentPage = number;
  }
  onPageBoundsCorrection(number: number) {
    this.config.currentPage = number;
  }

  InitNotifications() {
    this.notifyService.findByEventUser(this.currentUser.id).subscribe(ret => {
      if (ret['code'] === 200) {
        const events = ret['data'];
        const notifs = ret['Notification'];
        this.notifications = events.concat(notifs);
        console.log('notifs===', this.notifications);
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
  markAsRead(notif: any) {
    notif.read = true;
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
  }
}
