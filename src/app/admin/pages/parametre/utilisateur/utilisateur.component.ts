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
import { Service } from 'src/app/shared/models/service';
import { ServiceService } from 'src/app/shared/services/service.service';
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
  public allList: any[] = [];

  public selectedUsers: Utilisateur[] [];
  public utilisateur: Utilisateur = new Utilisateur();
  public cabinets: Cabinet[] = [];
  public cabinetFilter = { designation: '' };
  public services: Service[] = [];
  public serviceFilter = { designation: '' };
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
    private serviceService: ServiceService,
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
    this.searchParam.dateFin.setDate(this.searchParam.dateFin.getDate() + 1);
    this.search();
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
 
  showList() {
    this.currentView = 'list';
    this.pageTitle = 'Liste'
  }
  showAddForm() {
    this.utilisateur = new Utilisateur();
    this.findCabinets();
    this.findSevices();
    this.findProfiles();
    this.currentView = 'add';
    this.pageTitle = 'Nouveau utilisateur';
  }

  showEditForm(user: Utilisateur) {
    this.utilisateur = user;
    this.findCabinets();
    this.findSevices();
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
 search() {
    this.loading = true;
    this.utilisateurService.findAll().subscribe(
      (ret) => {
        this.loading = false;
        if (ret['code'] == 200) {
          this.utilisateurs = ret['data']['data'];
          // Séparer les listes
          this.activeList = this.utilisateurs.filter(d => d.statut === 'Activé');
          this.bloqueList = this.utilisateurs.filter(d => d.statut === 'Terminée');
          this.suppriList = this.utilisateurs.filter(d => d.statut === 'Supprimé');
          // ✅ Tout afficher par défaut
          this.allList = [...this.utilisateurs];
          // Calcul pagination
          this.totalPages = Math.ceil(this.allList.length / this.itemsPerPage);
          this.updatePaginatedList();
          this.toast.info(`${this.utilisateurs.length} demande(s) trouvée(s)`);
        } else {
          this.toast.error(ret['message']);
        }
      },
      () => {
        this.toast.error(environment.erreur_connexion_message);
        this.loading = false;
      }
    );
  }

  updatePaginatedList() {
    let sourceList: any[] = [];
    // 🟢 Choisir la liste selon le filtre actif
    switch (this.currentIndex) {
      case 1:
        sourceList = this.activeFiltres();
        break;
      case 2:
        sourceList = this.bloqueFiltres();
        break;
      case 3:
        sourceList = this.supprimeFiltres();
        break;
      default:
        sourceList = this.allFiltres(); // ✅ Tous par défaut
        break;
    }
    // Pagination
    this.totalPages = Math.ceil(sourceList.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedList = sourceList.slice(startIndex, startIndex + this.itemsPerPage);
    console.log("+++++ paginatedList affichée +++++", this.paginatedList);
  }

  // ✅ Filtres pour chaque catégorie + "Tous"
  allFiltres() {
    if (!this.searchFilterText) return this.allList;
    const search = this.searchFilterText.toLowerCase();
    return this.allList.filter(item =>
      (item.visiteur.nomComplet + ' ' + item.numeroTelephone + ' ' + item.cabinet?.designation)
        .toLowerCase()
        .includes(search)
    );
  }

  activeFiltres() {
    if (!this.searchFilterText) return this.activeList;
    const search = this.searchFilterText.toLowerCase();
    return this.activeList.filter(item =>
      (item.nomComplet + ' ' + item.telephone + ' ' + item.cabinet?.designation)
        .toLowerCase()
        .includes(search)
    );
  }

  bloqueFiltres() {
    if (!this.searchFilterText) return this.bloqueList;
    const search = this.searchFilterText.toLowerCase();
    return this.bloqueList.filter(item =>
      (item.nomComplet + ' ' + item.telephone + ' ' + item.cabinet?.designation).toLowerCase().includes(search)
    );
  }

  supprimeFiltres() {
    if (!this.searchFilterText) return this.suppriList;
    const search = this.searchFilterText.toLowerCase();
    return this.suppriList.filter(item =>
      (item.nomComplet + ' ' + item.telephone + ' ' + item.cabinet?.designation).toLowerCase().includes(search)
    );
  }

  onChangeCode(index: number) {
    this.currentIndex = index;
    this.currentPage = 1;
    this.updatePaginatedList();
    // Gérer les boutons actifs
    ['user_active', 'user_block', 'user_delete', 'user_all'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.classList.toggle('btn_active', id === this.getButtonIdByIndex(index));
        btn.classList.toggle('btn_not_active', id !== this.getButtonIdByIndex(index));
      }
    });
  }

  getButtonIdByIndex(index: number): string {
    switch (index) {
      case 1: return 'user_active';
      case 2: return 'user_block';
      case 3: return 'user_delete';
      default: return 'user_all'; // ✅ nouveau bouton "Tous"
    }
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
  Save() {
    this.utilisateur.nomComplet = this.utilisateur.prenom + ' ' + this.utilisateur.nom;
    this.utilisateur.statut = "Activé";
    //this.utilisateur.service_name = this.currentUser.service_name;
    this.utilisateur.image = null;
    //this.utilisateur.cabinet_id = this.utilisateur.cabinet.id;
    //this.utilisateur.service_id = this.utilisateur.service.id;
    this.loading = true;
    this.utilisateurService.save(this.utilisateur).subscribe(ret => {
      if (ret['code'] === 200) {
        this.utilisateur = ret['data'];
        //this.utilisateurs.push(this.utilisateur);
        this.closeAddElementDialog.nativeElement.click();
        this.toast.success("Utilisateur ajouté avec succès");
        this.loading = false;
        this.search();
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
    this.utilisateur.service_id = this.utilisateur.service.id;
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
        this.search();
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
 // ✅ Ferme le modal après mise à jour
  ActiverUtilisateur(): void {
    console.log("++++++++++++++++++++ users+++++++++++++++",this.utilisateur)
    this.loading = true;
    this.utilisateurService.activer(this.utilisateur).subscribe({
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
 // ✅ Ferme le modal après mise à jour
  DesactiverUtilisateur(): void {
    console.log("++++++++++++++++++++ users+++++++++++++++",this.utilisateur)
    this.loading = true;
    this.utilisateurService.desactiver(this.utilisateur).subscribe({
      next: (ret) => {
        this.loading = false;
        if (ret['code'] === 200) {
          this.utilisateur = ret['data'];
          this.showList();
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

  checkCabinetUser(cabinetId: number, serviceId: number) {
    if(serviceId !== 3) {
      return;
    }
    if (!cabinetId) {
      this.toast.error("Veuillez selectionner un cabinet, SVP ..");
      this.utilisateur.service = null;
      return
    }
    const objetCheck = {
      cabinet_id: cabinetId,
      service_id: serviceId
    }
    this.utilisateurService.verifyJugeOfCabinet(objetCheck).subscribe(ret => {
      if (ret['code'] === 200) {
      } else {
        this.toast.error(ret['message']);
        this.loading = false;
        this.utilisateur.cabinet = null;
        this.utilisateur.service = null;
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

  findSevices() {
    this.serviceService.findAll().subscribe(ret => {
      if (ret['code'] === 200) {
        this.services = ret['data'];
        if (this.currentView === 'edit' || this.currentView === 'detail' && this.utilisateur.service_id && this.services.length > 0) {
          this.utilisateur.service = this.services.find(p => p.id === this.utilisateur.service_id)
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
