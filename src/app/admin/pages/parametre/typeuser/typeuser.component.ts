import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppToastService } from 'src/app/shared/utils/AppToast.service';
import { AppConfig } from 'src/app/shared/utils/app-config';
import { RoleManager } from 'src/app/shared/utils/role-manager';
import { SearchParam } from 'src/app/shared/utils/search-param';
import * as SecureLS from 'secure-ls';
import { Utilisateur } from 'src/app/shared/models/utilisateur';
import { Service } from 'src/app/shared/models/service';
import { ServiceService } from 'src/app/shared/services/service.service';
import { environment } from 'src/environments/environment';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-typeuser',
  templateUrl: './typeuser.component.html',
  styleUrls: ['./typeuser.component.css']
})
export class TypeuserComponent implements OnInit {
 public service: Service;
   public services: Service[] = [];
   public selectedServices: Service[]
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
     { id: 1, name: 'N° du type' },
     { id: 2, name: 'Nom du type' },
     { id: 3, name: 'Nom description' },
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
     private serviceService: ServiceService,
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
   this.serviceFiltres().map(item => ({
    ...item,
    selected: false
  }));

this.totalPages = Math.ceil(this.serviceFiltres().length / this.itemsPerPage);
    this.updatePaginatedList();
  }
 updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.serviceFiltres();
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
  this.serviceFiltres().forEach(item => item.selected = this.selectAll);
}

toggleSelectOne() {
  // si tous sont cochés, selectAll = true sinon false
  this.selectAll = this.serviceFiltres().every(item => item.selected);
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
   serviceFiltres () {
     if (!this.searchFilterText) return this.services
     const search = this.searchFilterText.toLowerCase()
     return this.services.filter(item => {
       const text = (item.id + ' ' + item.designation).toLowerCase()
       return text.indexOf(search) > -1
     })
   }
   showList() {
      this.currentView = 'list';
    }
   showAddForm() {
     this.service = new Service();
     this.currentView = 'add';
   }
   showEditForm(service: Service) {
     this.service = service;
     this.currentView = 'add';
   }
   showConfirmDialog(service: Service): void {
     this.service = service;
     this.openConfirmDialog.nativeElement.click();
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

  showDeleteDialog(service: Service): void {
    this.service = service;
    if (this.deleteModal) {
      this.deleteModal.show();
    } else {
      console.warn("⚠️ Le modal n’a pas été initialisé.");
    }
  }
  closeDeleteDialog(): void {
    this.deleteModal?.hide();
  }
  deleteService(): void {
    if (this.service) {
      console.log(`Suppression de ${this.service.designation}`);
       this.loading = true;
      this.service.user_id = this.currentUser.id
      this.serviceService.delete(this.service).subscribe((ret:any) => {
       if (ret['code'] == 200) {
         this.service = ret['data'];
         // this.openConfirmDialog.nativeElement.click();
         this.closeDeleteDialog();
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
  }
   Search() {
     this.loading = true;
     this.serviceService.findAll().subscribe(ret => {
       if (ret['code'] === 200) {
         this.services = ret['data'];
         this.loading = false;
         this.toast.info(this.services.length+ " service(s) trouvé(s)");
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
     this.service.statut = "Activé";
    // this.service.nombregreffier = 0;
    this.service.user_id = this.currentUser.id
     this.loading = true;
     this.serviceService.save(this.service).subscribe(ret => {
       if (ret['code'] === 200) {
         this.service = ret['data'];
         this.services.push(this.service)
         this.loading = false;
         this.closeAddElementDialog.nativeElement.click();
         this.toast.success("Service enregistré avec succès");
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
    this.service.user_id = this.currentUser.id
    this.serviceService.update(this.service).subscribe(
      (ret:any) => {
       if (ret['code'] == 200) {
        this.service = ret['data'];
           this.closeAddElementDialog.nativeElement.click();
         this.toast.success("Type User modifié avec succès");
          this.loading = false;
          this.showList();
          this.Search();
        } else {
          this.toast.error(ret['message']);
          this.loading = false;
        }
      },
      (error) => {
        this.toast.error(environment.erreur_connexion_message);
        this.loading = false;
      }
    );
  }
   UpdateStatut(statut: string) {
     this.loading = true;
     this.service.user_id = this.currentUser.id
     this.service.statut = statut;
     this.serviceService.updateStatut(this.service).subscribe(ret => {
       if (ret['code'] === 200) {
         this.service = ret['data'];
         this.services.forEach(user => {
           if(user.id === this.service.id){
             user.statut = this.service.statut;
           }
         });
         if(statut === 'Bloqué') {
           this.openConfirmDialog.nativeElement.click();
         } else {
           this.deleteConfirmDialog.nativeElement.click();
         }
         this.toast.success(ret['message']);
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
      onDeleted(): void {
      this.loading = true;
      this.service.user_id = this.currentUser.id
      this.serviceService.delete(this.service).subscribe((ret:any) => {
       if (ret['code'] == 200) {
         this.service = ret['data'];
          this.openConfirmDialog.nativeElement.click();
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
 }
 