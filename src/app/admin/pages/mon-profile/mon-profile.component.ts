import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser } from 'src/app/shared/models/auth-user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AppToastService } from 'src/app/shared/utils/AppToast.service';
import { AppConfig } from 'src/app/shared/utils/app-config';
import { environment } from 'src/environments/environment';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { RoleManager } from 'src/app/shared/utils/role-manager';
import * as SecureLS from 'secure-ls';
import { Utilisateur } from 'src/app/shared/models/utilisateur';

@Component({
  selector: 'app-mon-profile',
  templateUrl: './mon-profile.component.html',
  styleUrls: ['./mon-profile.component.css']
})
export class MonProfileComponent implements OnInit {

  public currentUser: Utilisateur;
  public roleManager: RoleManager;
  public authUser: AuthUser;
  public loading: boolean;
  public isDark: boolean;
  public isChanged: boolean = false;
  @ViewChild('fileInputUpload', { static: false }) fileInputUpload: ElementRef;

  constructor(
    private router: Router,
    private toast: AppToastService,
    private userService: UtilisateurService,
    private authService: AuthService,
    private appConfig: AppConfig) {
    this.currentUser = this.appConfig.currentUser;
    this.roleManager = new RoleManager();
    this.authUser = new AuthUser();
  }

  ngOnInit(): void {
    const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: 'MyAdminApp' });
    if (ls.get('current_theme')) {//dark
      this.isDark = true;
      const headerLeft = document.getElementsByClassName("theme-light");
      for(var i = headerLeft.length - 1; i >= 0; --i) {
        headerLeft[i].classList.replace('theme-light', 'theme-dark');
      }
      const labelColor = document.getElementsByClassName("c-cab-2");
      for(var i = labelColor.length - 1; i >= 0; --i) {
        labelColor[i].classList.replace('c-cab-2', 'c-cab-1');
      }
    } else {//white
      this.isDark = false;
      const headerLeft = document.getElementsByClassName("theme-dark");
      for(var i = headerLeft.length - 1; i >= 0; --i) {
        headerLeft[i].classList.replace('theme-dark', 'theme-light');
      }
      const labelColor = document.getElementsByClassName("c-cab-1");
      for(var i = labelColor.length - 1; i >= 0; --i) {
        labelColor[i].classList.replace('c-cab-1', 'c-cab-2');
      }
    }
  }

  showChangePwd() {
    this.authUser.id = this.currentUser.id;
    this.authUser.userId = this.currentUser.id;
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
    this.loading = true;
    this.authService.changePassword(this.authUser).subscribe(ret => {
      if (ret['code'] === 200) {
        localStorage.removeItem('current_session_novus');
        this.router.navigate(['/login']);
        this.toast.success(ret['message']);
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
  UpdateImage() {
    this.userService.updateImage(this.currentUser).subscribe(ret => {
      if (ret['code'] === 200) {
        this.currentUser = ret['data'];
        localStorage.removeItem('current_session_novus');
        localStorage.removeItem('current_theme');
        this.router.navigate(['/login']);
        this.loading = false;
        this.isChanged = false;
        this.toast.success(ret['message']);
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
  SaveUser() {
    this.userService.update(this.currentUser).subscribe(ret => {
      if (ret['code'] === 200) {
        this.currentUser = ret['data'];
        localStorage.removeItem('current_session_novus');
        localStorage.removeItem('current_theme');
        this.router.navigate(['/login']);
        this.loading = false;
        this.toast.success("Utilisateur sauvegardé avec succès");
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
  /* update photo */
  selectFile() {
    this.fileInputUpload.nativeElement.click();
  }
  deletePhoto() {
    this.currentUser.image = null;
    this.isChanged = false;
  }
  onFileUploadChange(event) {
    this.isChanged = true;
    if (event.target.files.length <= 0) {
      this.isChanged = false;
      return;
    }
    let file = event.target.files[0];
    if ((file.size / 1024) > 1024 * 1024 * 5) {
      alert("La taille à dépasser 5 Mo");
      this.isChanged = false;
      return;
    }
    let reader = new FileReader();
    reader.onload = readerEvent => {
      this.currentUser.image = (readerEvent.target as any).result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }
}
