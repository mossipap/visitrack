import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { AppToastService } from 'src/app/shared/utils/AppToast.service';
import { AppConfig } from 'src/app/shared/utils/app-config';
import { RoleManager } from 'src/app/shared/utils/role-manager';
import { SearchParam } from 'src/app/shared/utils/search-param';
import { environment } from 'src/environments/environment';
import { CabinetService } from 'src/app/shared/services/cabinet.service';
import { Cabinet } from 'src/app/shared/models/cabinet';
import { Profil } from 'src/app/shared/models/profil';
import { ProfileService } from 'src/app/shared/services/profil.service';
import * as SecureLS from 'secure-ls';
import { TypeUser } from 'src/app/shared/models/type-user';
import { TypeUserService } from 'src/app/shared/services/typeuser.service';
import { Utilisateur } from 'src/app/shared/models/utilisateur';
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.css']
})
export class UtilisateurComponent implements OnInit {
  public utilisateurs: Utilisateur[] = [];
  public activeList: Utilisateur[] = [];
  public bloqueList: Utilisateur[] = [];
  public suppriList: Utilisateur[] = [];
  public selectedUsers: Utilisateur[] [];
  public utilisateur: Utilisateur = new Utilisateur();
  public cabinets: Cabinet[] = [];
  public cabinetFilter = { designation: '' };
  public typeUsers: TypeUser[] = [];
  public typeUserFilter = { designation: '' };
  public profiles: Profil[] = [];
  public profileFilter = { nom: '' };
  public roleManager: RoleManager;
  public searchParam: SearchParam;
  public isSearch: boolean = false;
  public currentUser: any;
  public loading: boolean;
  public isDark: boolean;
  public pageTitle = 'Liste';
  public searchFilterText: string = '';
  public dialogAction: string;
  public confirmPassword: string;
  public currentIndex: any = 1;
  public nombreAssistante: number = 0;
  public nombreGreffier: number = 0;
  public nombreJuge: number = 0;
  public criteriaList = [
    { name: 'Prénom et nom' },
    { name: 'Email'},
    { name: 'Profession' },
    { name: 'Login' },
    { name: 'Cabinet' }
  ];
    sexes = [
    { id: 'Homme', sexe: 'Homme' },
    { id: 'Femme', sexe: 'Femme' },
    { id: 'Autre', sexe: 'Autre' }
  ];
  @ViewChild('openConfirmDialog') openConfirmDialog: any;
  @ViewChild('deleteConfirmDialog') deleteConfirmDialog: any;
  @ViewChild('closeAddElementDialog') closeAddElementDialog: any;
  @ViewChild('fileInputUpload', { static: false }) fileInputUpload: ElementRef;
private deleteModal?: Modal;
 paginatedList: any[] = []; // la portion affichée
  itemsPerPage = 10; // nombre d’éléments par page
  totalPages = 0;
  selectAll: boolean = false;
  public currentView = 'list';
  public currentPage = 1; 
  constructor(
    private utilisateurService: UtilisateurService,
    private cabinetService: CabinetService,
    private typeUserService: TypeUserService,
    private profileService: ProfileService,
    private toast: AppToastService,
    private appConfig: AppConfig
  ) {
    this.currentUser = this.appConfig.currentUser;
    this.roleManager = new RoleManager();
    this.searchParam = new SearchParam();
  }

  ngOnInit(): void {
    const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: 'MyAdminApp' });
    if (ls.get('current_theme')) {//dark
      this.isDark = true;
      const headerLeft = document.getElementsByClassName("theme-light");
      for(var i = headerLeft.length - 1; i >= 0; --i) {
        headerLeft[i].classList.replace('theme-light', 'theme-dark');
      }
      this.changeRowPad('rgb(21 21 21 / 100%)');
      this.changeStepLabel('#FFFFFF');
      this.changeBgsearchbar('rgb(28, 28, 28)');
      this.changePaginationBg('#000000');
      this.changePaginationFg('#ffffff');
      this.changePrimeTbBg('#000000');
      this.changeTrHover('#1c1c1c');
      this.changePrimeTbHead('#000000');
      this.changePaginatorLight('#252116');
      this.changeBtnDivBg('#252117');
    } else {//white
      this.isDark = false;
      const headerLeft = document.getElementsByClassName("theme-dark");
      for(var i = headerLeft.length - 1; i >= 0; --i) {
        headerLeft[i].classList.replace('theme-dark', 'theme-light');
      }
      this.changeRowPad('rgb(255 255 255 / 100%)');
      this.changeStepLabel('#7f56d9');
      this.changeBgsearchbar('rgba(255, 255, 255, 0.8)');
      this.changePaginationBg('#ffffff');
      this.changePaginationFg('#000000');
      this.changePrimeTbBg('none');
      this.changeTrHover('rgba(0, 0, 0, 0.3)');
      this.changePrimeTbHead('#f8f9fa');
      this.changePaginatorLight('#ecf5ee');
      this.changeBtnDivBg('#faf4f3');
      this.changeBgTheader('rgba(255, 199, 154, 0.5)');
    }
    this.searchParam.dateFin.setDate(this.searchParam.dateFin.getDate() + 1);
    this.initUsers();
   this.activeList.map(item => ({
    ...item,
    selected: false
  }));

this.totalPages = Math.ceil(this.activeList.length / this.itemsPerPage);
    this.updatePaginatedList();
  }
 updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.activeList.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedList();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedList();
    }
  }
getInitials(fullName: string): string {
  if (!fullName) return '';
  return fullName
    .split(' ')
    .map(p => p.charAt(0).toUpperCase())
    .join('')
    .slice(0, 3);
}

getSexColor(sexe: string): string {
  if (!sexe) return '#999';

  // Normalisation
  sexe = sexe.toLowerCase();

  // Homme
  if (sexe === 'Homme' || sexe === 'masculin' || sexe === 'male') {
    return '#2196F3'; // Bleu
  }

  // Femme
  if (sexe === 'Femme' || sexe === 'feminin' || sexe === 'female') {
    return '#f45187ff'; // Rose doux
  }

  return '#666'; // Valeur neutre si non défini
}
toggleSelectAll() {
  this.selectAll = !this.selectAll;
  this.activeList.forEach(item => item.selected = this.selectAll);
}

toggleSelectOne() {
  // si tous sont cochés, selectAll = true sinon false
  this.selectAll = this.activeList.every(item => item.selected);
}
  changeRowPad(newValue: string): void {
    document.documentElement.style.setProperty('--bg-trtable', newValue);
  }
  changeTrHover(newValue: string): void {
    document.documentElement.style.setProperty('--tr-hover', newValue);
  }
  changePaginationBg(newValue: string): void {
    document.documentElement.style.setProperty('--bgpaginator', newValue);
  }
  changePaginationFg(newValue: string): void {
    document.documentElement.style.setProperty('--fgpaginator', newValue);
  }
  changePrimeTbBg(newValue: string): void {
    document.documentElement.style.setProperty('--bgprimetb', newValue);
  }
  changePrimeTbHead(newValue: string): void {
    document.documentElement.style.setProperty('--bgprimetbhead', newValue);
  }
  changePaginatorLight(newValue: string): void {
    document.documentElement.style.setProperty('--paginatorlight', newValue);
  }
  changeBgsearchbar(newValue: string): void {
    document.documentElement.style.setProperty('--bg-searchbar', newValue);
  }
  changeStepLabel(newValue: string): void {
    document.documentElement.style.setProperty('--step-label', newValue);
  }
  changeBtnDivBg(newValue: string): void {
    document.documentElement.style.setProperty('--btndiv', newValue);
  }
  changeBgTheader(newValue: string): void {
    document.documentElement.style.setProperty('--theaderbg', newValue);
  }
  activeFiltres () {
    if (!this.searchFilterText) return this.activeList
    const search = this.searchFilterText.toLowerCase()
    return this.activeList.filter(item => {
      const text = (item.prenom + ' ' + item.nom + ' ' + item.login+ ' '+ item.cabinet?.id).toLowerCase();
      return text.indexOf(search) > -1
    })
  }
  bloqueFiltres () {
    if (!this.searchFilterText) return this.bloqueList
    const search = this.searchFilterText.toLowerCase()
    return this.bloqueList.filter(item => {
      const text = (item.prenom + ' ' + item.nom + ' ' + item.login).toLowerCase();
      return text.indexOf(search) > -1
    })
  }
  supprimeFiltres () {
    if (!this.searchFilterText) return this.suppriList
    const search = this.searchFilterText.toLowerCase()
    return this.suppriList.filter(item => {
      const text = (item.prenom + ' ' + item.nom + ' ' + item.login).toLowerCase();
      return text.indexOf(search) > -1
    })
  }

  onChangeCode(index) {
    if(index === 1) {//active
      let btnUserActive = document.getElementById("user_active");
      let btnUserBlock = document.getElementById("user_block");
      let btnUserDelete = document.getElementById("user_delete");

      btnUserActive.classList.add("btn_active");
      btnUserActive.classList.remove("btn_not_active");
      btnUserBlock.classList.add("btn_not_active");
      btnUserBlock.classList.remove("btn_active");
      btnUserDelete.classList.add("btn_not_active");
      btnUserDelete.classList.remove("btn_active");
      this.currentIndex = index;
    } else if(index === 2) {//block
      let btnUserBlock = document.getElementById("user_block");
      let btnUserActive = document.getElementById("user_active");
      let btnUserDelete = document.getElementById("user_delete");

      btnUserBlock.classList.add("btn_active");
      btnUserBlock.classList.remove("btn_not_active");
      btnUserActive.classList.add("btn_not_active");
      btnUserActive.classList.remove("btn_active");
      btnUserDelete.classList.add("btn_not_active");
      btnUserDelete.classList.remove("btn_active");
      this.currentIndex = index;
    } else {//delete
      let btnUserDelete = document.getElementById("user_delete");
      let btnUserActive = document.getElementById("user_active");
      let btnUserBlock = document.getElementById("user_block");

      btnUserDelete.classList.add("btn_active");
      btnUserDelete.classList.remove("btn_not_active");
      btnUserBlock.classList.add("btn_not_active");
      btnUserBlock.classList.remove("btn_active");
      btnUserActive.classList.add("btn_not_active");
      btnUserActive.classList.remove("btn_active");
      this.currentIndex = index;
    }
  }

  showList() {
    this.currentView = 'list';
    this.pageTitle = 'Liste'
  }
  showAddForm() {
    this.utilisateur = new Utilisateur();
    this.findCabinets();
    this.findTypeusers();
    this.findProfiles();
    this.currentView = 'add';
    this.pageTitle = 'Nouveau utilisateur';
  }

  showEditForm(user: Utilisateur) {
    this.utilisateur = user;
    this.findCabinets();
    this.findTypeusers();
    this.findProfiles();
    this.currentView = 'edit';
    this.pageTitle = 'Modification d\'utilisateur';
  }

  showDetail(user: Utilisateur) {
    this.utilisateur = user;
    //this.currentView = 'detail';
    this.pageTitle = 'Détails user'
  }

  showResetDialog(utilisateur: Utilisateur): void {
    this.utilisateur = utilisateur;
  }

  // ✅ Ouvre proprement le modal Bootstrap
  showConfirmDialog(utilisateur: Utilisateur, action: string): void {
    this.dialogAction = action;
    this.utilisateur = utilisateur;
    const modalEl = document.getElementById('confirmModal');
    if (modalEl) {
      const modal = new Modal(modalEl);
      modal.show();
    } else {
      console.warn('⚠️ Modal #confirmModal introuvable dans le DOM.');
    }
  }


  showDeleteDialog1(utilisateur: Utilisateur): void {
    this.utilisateur = utilisateur;
    this.deleteConfirmDialog.nativeElement.click();
  }

initUsers() {
  this.loading = true;
  this.utilisateurService.findAll().subscribe({
    next: (ret) => {
      if (ret['code'] === 200) {
        const users = ret['data'];

        // Déclarer tes listes AVANT de les utiliser
        const actiList: any[] = [];
        const blocList: any[] = [];
        const deleList: any[] = [];

        users.forEach((user: any) => {
          user.nomComplet = `${user.prenom} ${user.nom}`;

          // Séparer selon le service
          if (this.currentUser.service_name === 'siege') {
            if (user.service_name === 'siege') this.utilisateurs.push(user);
          } else {
            if (user.service_name === 'parquet') this.utilisateurs.push(user);
          }
          // Classer par statut
          switch (user.statut) {
            case 'Activé':
              actiList.push(user);
              break;
            case 'Bloqué':
              blocList.push(user);
              break;
            case 'Supprimé':
              deleList.push(user);
              break;
          }
        });
        // Affecter les listes à la fin
        this.activeList = actiList;
        this.bloqueList = blocList;
        this.suppriList = deleList;
        this.loading = false;
        this.toast.info(`${this.utilisateurs.length} utilisateur(s) trouvé(s)`);
      } else {
        this.toast.error(ret['message']);
        this.loading = false;
      }
    },
    error: () => {
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
    }
  });
}

  Save() {
    this.utilisateur.nomComplet = this.utilisateur.prenom + ' ' + this.utilisateur.nom;
    this.utilisateur.statut = "Activé";
    this.utilisateur.service_name = this.currentUser.service_name;
    this.utilisateur.image = null;
    this.loading = true;
    this.utilisateurService.save(this.utilisateur).subscribe(ret => {
      if (ret['code'] === 200) {
        this.utilisateur = ret['data'];
        this.utilisateurs.push(this.utilisateur);
        this.closeAddElementDialog.nativeElement.click();
        this.toast.success("Utilisateur ajouté avec succès");
        this.loading = false;
        this.initUsers();
        this.showList();
      } else {
        this.loading = false;
        this.toast.error(ret['message']);
      }
    }, error => {
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
    });
  }
  Update() {
    this.loading = true;
    /* this.utilisateur.cabinet_id = this.utilisateur.cabinet.id;
    this.utilisateur.typeUser_id = this.utilisateur.typeUser.id;
    this.utilisateur.profil_id = this.utilisateur.profil.id; */
    this.utilisateurService.update(this.utilisateur).subscribe(ret => {
      if (ret['code'] === 200) {
        this.utilisateur = ret['data'];
        this.utilisateurs.forEach(user => {
          if(user.id === this.utilisateur.id) {
            user = this.utilisateur;
          }
        });
        this.closeAddElementDialog.nativeElement.click();
        this.toast.success("Utilisateur modifié avec succès");
        this.loading = false;
        this.showList();
        this.initUsers();
      } else {
        this.toast.error(ret['message']);
        this.loading = false;
      }
    }, error => {
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
    });
  }
 // ✅ Ferme le modal après mise à jour
  UpdateStatut(statut: string): void {
    this.loading = true;
    this.utilisateur.statut = statut;
    this.utilisateurService.updateStatut(this.utilisateur).subscribe({
      next: (ret) => {
        this.loading = false;
        if (ret['code'] === 200) {
          this.utilisateur = ret['data'];
          // Met à jour la liste
          this.utilisateurs.forEach(u => {
            if (u.id === this.utilisateur.id) u.statut = this.utilisateur.statut;
          });
          // ✅ Fermer le modal proprement
          const modalEl = document.getElementById('confirmModal');
          if (modalEl) {
            const modal = Modal.getInstance(modalEl);
            modal?.hide();
          }
          this.toast.success('Opération effectuée avec succès.');
        } else {
          this.toast.error(ret['message']);
        }
      },
      error: () => {
        this.toast.error(environment.erreur_connexion_message);
        this.loading = false;
      }
    });
  }

  checkCabinetUser(cabinetId: number, typeUserId: number) {
    if(typeUserId !== 3) {
      return;
    }
    if (!cabinetId) {
      this.toast.error("Veuillez selectionner un cabinet, SVP ..");
      this.utilisateur.typeUser = null;
      return
    }
    const objetCheck = {
      cabinet_id: cabinetId,
      typeUser_id: typeUserId
    }
    this.utilisateurService.verifyJugeOfCabinet(objetCheck).subscribe(ret => {
      if (ret['code'] === 200) {
      } else {
        this.toast.error(ret['message']);
        this.loading = false;
        this.utilisateur.cabinet = null;
        this.utilisateur.typeUser = null;
      }
    }, error => {
      console.log("error===", error);
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
    });
  }

  resetPwd(): void {
    if (this.utilisateur.newPassword.length <= 0) {
      this.toast.warning("Tous les champs sont obligatoire");
      return;
    }
    if (this.utilisateur.newPassword.length < 5) {
      this.toast.warning("Le nouveau mot de passe doit être supérieur à 5 caractères");
      return;
    }
    if (this.utilisateur.newPassword !== this.confirmPassword) {
      this.toast.warning("Veuillez confirmez votre mot de passe");
      return;
    }
    this.loading = true;
    this.utilisateurService.changePassword(this.utilisateur).subscribe(ret => {
      if (ret['code'] === 200) {
        this.loading = false;
        this.toast.success(ret['message']);
      } else {
        this.loading = false;
        this.toast.error(ret['message']);
      }
    }, error => {
      console.log("error====>", error);
      this.loading = false;
      this.toast.error('Une erreur est survenue lors de l\'opération');
    });
  }

  findCabinets() {
    this.cabinetService.findAll().subscribe(ret => {
      if (ret['code'] === 200) {
        this.cabinets = ret['data'];
        if (this.currentView === 'edit' || this.currentView === 'detail' && this.utilisateur.cabinet && this.cabinets.length > 0) {
          this.utilisateur.cabinet = this.cabinets.find(p => p.id === this.utilisateur.cabinet.id)
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

  findTypeusers() {
    this.typeUserService.findAll().subscribe(ret => {
      if (ret['code'] === 200) {
        this.typeUsers = ret['data'];
        if (this.currentView === 'edit' || this.currentView === 'detail' && this.utilisateur.type_user_id && this.typeUsers.length > 0) {
          this.utilisateur.typeUser = this.typeUsers.find(p => p.id === this.utilisateur.type_user_id)
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
  findProfiles() {
    this.profileService.findAll().subscribe(ret => {
      if (ret['code'] === 200) {
        this.profiles = ret['data'];
        if (this.currentView === 'edit' || this.currentView === 'detail' && this.utilisateur.profil_id && this.profiles.length > 0) {
          this.utilisateur.profil = this.profiles.find(p => p.id === this.utilisateur.profil_id)
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

  /* *********************Upload Photo************** */
  selectPicture() {
    this.fileInputUpload.nativeElement.click();
  }
  deleteImageProfile() {
  }
  onFileUploadChange(event) {
    if (event.target.files.length <= 0) {
      return;
    }
    let file = event.target.files[0];
    if (!file.type.includes("image")) {
      this.toast.info("Veuilez choisir une image!");
      return;
    }
    if ((file.size / 1024) > 1024 * 1024 * 5) {
      this.toast.info("La taille à dépasser 5 Mo");
      return;
    }
    let reader = new FileReader();
    reader.onload = readerEvent => {
      //this.imageProfile = (readerEvent.target as any).result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }


 ngAfterViewInit(): void {
    // Initialise le modal après que le DOM soit prêt
    const modalEl = document.getElementById('deleteModal');
    if (modalEl) {
      this.deleteModal = new Modal(modalEl, { backdrop: 'static', keyboard: false });
    } else {
      console.error("⚠️ Élément #deleteModal introuvable dans le DOM.");
    }
  }

  showDeleteDialog(utilisateur: Utilisateur): void {
    this.utilisateur = utilisateur;
    if (this.deleteModal) {
      this.deleteModal.show();
    } else {
      console.warn("⚠️ Le modal n’a pas été initialisé.");
    }
  }
  closeDeleteDialog(): void {
    this.deleteModal?.hide();
  }
DeleteUtilisateur() {
  this.loading = true;
    this.utilisateurService.delete(this.utilisateur).subscribe(ret => {
      if (ret['code'] === 200) {
        this.utilisateur = ret['data'];
        this.utilisateurs.filter(u => { return u.id !== this.utilisateur.id});
        this.closeDeleteDialog();
        this.toast.success("Utilisateur supprimé avec succès");
        this.loading = false;
      } else {
        this.toast.error(ret['message']);
        this.loading = false;
      }
    }, error => {
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
    });
}
}
