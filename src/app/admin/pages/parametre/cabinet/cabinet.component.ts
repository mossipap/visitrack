import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Cabinet } from 'src/app/shared/models/cabinet';
import { CabinetService } from 'src/app/shared/services/cabinet.service';
import { AppToastService } from 'src/app/shared/utils/AppToast.service';
import { RoleManager } from 'src/app/shared/utils/role-manager';
import { Utilisateur } from 'src/app/shared/models/utilisateur';
import { AppConfig } from 'src/app/shared/utils/app-config';
import { UtilisateurService } from 'src/app/shared/services/utilisateur.service';
import { environment } from 'src/environments/environment';
import { SearchParam } from 'src/app/shared/utils/search-param';
import * as SecureLS from 'secure-ls';
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.css']
})
export class CabinetComponent implements OnInit {
  public cabinet: Cabinet;
  public cabinets: Cabinet[] = [];
  public selectedCabinets: Cabinet[]
  public utilisateurs: Utilisateur[] = [];
  public userFilter = { prenom: '' };
  public roleManager: RoleManager;
  public searchParam: SearchParam;
  public isSearch: boolean = false;
  public currentUser: Utilisateur;
  public searchFilterText: string = '';
  public loading: boolean;
  public isDark: boolean;
  public criteriaList = [
    { id: 1, name: 'N° du cabinet' },
    { id: 2, name: 'Nom du cabinet' },
    { id: 3, name: 'Nom d\'organisation' },
  ];
  @ViewChild('closeAddElementDialog') closeAddElementDialog: any;
  @ViewChild('openConfirmDialog') openConfirmDialog: any;
 @ViewChild('deleteConfirmDialog', { static: false }) deleteConfirmDialog!: ElementRef;
 private deleteModal?: Modal;
 paginatedList: any[] = []; // la portion affichée
  itemsPerPage = 10; // nombre d’éléments par page
  totalPages = 0;
  selectAll: boolean = false;
  public currentView = 'list';
  public currentPage = 1; 
  constructor(
    private cabinetService: CabinetService,
    private utilisateurService: UtilisateurService,
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
      this.changePaginationBg('#000000');
      this.changePaginationFg('#ffffff');
      this.changePrimeTbBg('#000000');
      this.changePrimeTbHead('#000000');
      this.changePaginatorLight('#252116');
      this.changeRowPad('rgb(21 21 21 / 100%)');
      this.changeTrHover('#1c1c1c');
      this.changeBgsearchbar('rgb(28, 28, 28)');
      this.changeBgBtnSave('#f78e39');
      this.changeBgTheader('rgb(37 33 22)');
    } else {//white
      this.isDark = false;
      const headerLeft = document.getElementsByClassName("theme-dark");
      for(var i = headerLeft.length - 1; i >= 0; --i) {
        headerLeft[i].classList.replace('theme-dark', 'theme-light');
      }
      this.changePaginationBg('#ffffff');
      this.changePaginationFg('#000000');
      this.changePrimeTbBg('none');
      this.changePrimeTbHead('#f8f9fa');
      this.changePaginatorLight('#ecf5ee');
      this.changeRowPad('rgb(255 255 255 / 100%)');
      this.changeTrHover('rgba(0, 0, 0, 0.3)');
      this.changeBgsearchbar('rgba(255, 255, 255, 0.8)');
      this.changeBgBtnSave('#605bff');
      this.changeBgTheader('rgba(255, 199, 154, 0.5)');
    }
    this.searchParam.dateFin.setDate(this.searchParam.dateFin.getDate() + 1);
    this.Search();
  this.cabinets.map(item => ({
    ...item,
    selected: false
  }));

this.totalPages = Math.ceil(this.cabinets.length / this.itemsPerPage);
    this.updatePaginatedList();
  }
 updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.cabinets.slice(startIndex, endIndex);
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
  toggleSelectAll() {
  this.selectAll = !this.selectAll;
  this.cabinets.forEach(item => item.selected = this.selectAll);
}

toggleSelectOne() {
  // si tous sont cochés, selectAll = true sinon false
  this.selectAll = this.cabinets.every(item => item.selected);
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
  changeRowPad(newValue: string): void {
    document.documentElement.style.setProperty('--bg-trtable', newValue);
  }
  changeBgsearchbar(newValue: string): void {
    document.documentElement.style.setProperty('--bg-searchbar', newValue);
  }
  changeBgBtnSave(newValue: string): void {
    document.documentElement.style.setProperty('--btn-save-bg', newValue);
  }
  changeBgTheader(newValue: string): void {
    document.documentElement.style.setProperty('--theaderbg', newValue);
  }
  cabinetFiltres () {
    if (!this.searchFilterText) return this.cabinets
    const search = this.searchFilterText.toLowerCase()
    return this.cabinets.filter(item => {
      const text = (item.id + ' ' + item.designation).toLowerCase()
      return text.indexOf(search) > -1
    })
  }
  showList() {
     this.currentView = 'list';
   }
  showAddForm() {
    this.cabinet = new Cabinet();
    this.currentView = 'add';
  }
  showEditForm(cabinet: Cabinet) {
    this.cabinet = cabinet;
    this.currentView = 'add';
  }
  showConfirmDialog(cabinet: Cabinet): void {
    this.cabinet = cabinet;
    this.openConfirmDialog.nativeElement.click();
  }

  removePersonnel(perso: Utilisateur) {
    this.cabinet.personnels.forEach((elmt, index) => {
      if (elmt.id === perso.id) {
        this.cabinet.personnels.splice(index, 1);
      }
    });
  }

  Search() {
    this.loading = true;
    this.cabinetService.findAll().subscribe(ret => {
      if (ret['code'] === 200) {
        this.cabinets = ret['data'];
        this.loading = false;
        this.toast.info(this.cabinets.length+ " cabinet(s) trouvé(s)");
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
  Save() {
    this.cabinet.statut = "Activé";
   // this.cabinet.nombregreffier = 0;
    this.loading = true;
    this.cabinet.user_id = this.currentUser.id
    this.cabinetService.save(this.cabinet).subscribe(ret => {
      if (ret['code'] === 200) {
        this.cabinet = ret['data'];
        this.cabinets.push(this.cabinet)
        this.loading = false;
        this.closeAddElementDialog.nativeElement.click();
        this.toast.success("Cabinet enregistré avec succès");
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
  Update() {
    this.loading = true;
     this.cabinet.user_id = this.currentUser.id
    this.cabinetService.update(this.cabinet).subscribe(ret => {
      if (ret['code'] === 200) {
        this.cabinet = ret['data'];
        //this.cabinets.push(this.cabinet);
        this.cabinets.forEach(cab => {
          if (cab.id === this.cabinet.id) {
             this.Search();
            cab = this.cabinet;
          }
        });
        this.loading = false;
        this.closeAddElementDialog.nativeElement.click();
        this.toast.success("Cabinet modifié avec succès");
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
 UpdateStatut(statut: string) {
    this.loading = true;
    this.cabinet.statut = statut;
     this.cabinet.user_id = this.currentUser.id
    this.cabinetService.updateStatut(this.cabinet).subscribe({
      next: (ret) => {
        this.loading = false;
        if (ret['code'] === 200) {
          this.cabinet = ret['data'];
          this.cabinets.forEach(c => {
            if (c.id === this.cabinet.id) c.statut = this.cabinet.statut;
          });

          // ✅ Si statut = Bloqué, ouvrir le modal de confirmation
          if (statut === 'Bloqué') {
            const modalEl = document.getElementById('blockConfirmModal');
            if (modalEl) {
              const modal = new Modal(modalEl);
              modal.show();
            }
          }

          this.toast.success(ret['message']);
        } else {
          this.toast.error(ret['message']);
        }
      },
      error: () => {
        this.loading = false;
        this.toast.error(environment.erreur_connexion_message);
      }
    });
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
  
    showDeleteDialog(cabinet: Cabinet): void {
       this.cabinet = cabinet;
        //console.log("=++++++++++++++++ cabinet.id ++++++++++++", this.cabinet)
      if (this.deleteModal) {
        this.deleteModal.show();
      } else {
        console.warn("⚠️ Le modal n’a pas été initialisé.");
      }
    }
    closeDeleteDialog(): void {
      this.deleteModal?.hide();
    }
     onDeleted(): void {
     // console.log("=++++++++++++++++ cabinet.id ++++++++++++", this.cabinet)
     this.loading = true;
     this.cabinet.user_id = this.currentUser.id
     this.cabinetService.delete(this.cabinet).subscribe((ret:any) => {
      if (ret['code'] == 200) {
        this.cabinet = ret['data'];
         //this.openConfirmDialog.nativeElement.click();
         this.closeDeleteDialog()
         this.Search();
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
 
  initUsers() {
    this.utilisateurService.findAll().subscribe((ret) => {
      if (ret['code'] === 200) {
        this.utilisateurs = ret['data'];
        this.loading = false;
      } else {
        this.toast.error(ret['message']);
        this.loading = false;
      }
      },
      () => {
        this.toast.error('Problème de connexion');
        this.loading = false;
      }
    );
  }
}
