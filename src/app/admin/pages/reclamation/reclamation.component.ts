import { Component, OnInit, ViewChild } from '@angular/core';
import { AppConfig } from 'src/app/shared/utils/app-config';
import { AppToastService } from 'src/app/shared/utils/AppToast.service';
import * as SecureLS from 'secure-ls';
import { environment } from 'src/environments/environment';
import { Droit } from 'src/app/shared/models/droit';
import { RoleManager } from 'src/app/shared/utils/role-manager';
import { SearchParam } from 'src/app/shared/utils/search-param';
import { Reclamation } from 'src/app/shared/models/reclamation ';
import { ReclamationService } from 'src/app/shared/services/reclamation.service';
import { Utilisateur } from 'src/app/shared/models/utilisateur';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent implements OnInit {
  public reclamation: Reclamation;
  public reclamations: any[] = [];
  public selectedReclamations: Reclamation[]
  public droits: Droit[] = [];
  public droitFilter: any = { nom: '' }
  public roleManager: RoleManager;
  public searchParam: SearchParam;
  public isSearch: boolean = false;
  public currentUser: Utilisateur;
  public dialogAction: string;
  public searchFilterText: string = '';
  public loading: boolean;
  public isDark: boolean;
  public isSelectedRole: boolean;
  public criteriaList = [
    { id: 1, name: 'N° ID' },
    { id: 2, name: 'Nom' },
  ];
  @ViewChild('closeAddElementDialog') closeAddElementDialog: any;
  @ViewChild('openConfirmDialog') openConfirmDialog: any;
  @ViewChild('deleteConfirmDialog') deleteConfirmDialog: any;
  paginatedList: any[] = []; // la portion affichée
  itemsPerPage = 10; // nombre d’éléments par page
  totalPages = 0;
  selectAll: boolean = false;
  public currentView = 'list';
  public currentPage = 1; 
  constructor(
    private reclamationService: ReclamationService,
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
      for (var i = headerLeft.length - 1; i >= 0; --i) {
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
      for (var i = headerLeft.length - 1; i >= 0; --i) {
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
      this.changeBgTheader('#296af7ff');
    }
    this.searchParam.dateFin.setDate(this.searchParam.dateFin.getDate() + 1);
   // this.Search();
      this.reclamations = [
  {
    "id": 1,
    "description": "Problème de facturation sur la dernière commande",
    "statut": "ENVOYER",
    "dateCreation": "2025-09-20T09:15:00Z",
    "dateModification": "2025-09-20T09:15:00Z"
  },
  {
    "id": 2,
    "description": "Erreur dans l’adresse de livraison",
    "statut": "ENVOYER",
    "dateCreation": "2025-09-18T14:45:00Z",
    "dateModification": "2025-09-21T10:30:00Z"
  },
  {
    "id": 3,
    "description": "Produit reçu endommagé, demande de remplacement",
    "statut": "ENVOYER",
    "dateCreation": "2025-09-10T11:00:00Z",
    "dateModification": "2025-09-15T08:20:00Z"
  },
  {
    "id": 4,
    "description": "Demande d’assistance technique pour configuration",
    "statut": "ENVOYER",
    "dateCreation": "2025-09-12T16:10:00Z",
    "dateModification": "2025-09-21T13:45:00Z"
  },
  {
    "id": 5,
    "description": "Réclamation sur un retard de remboursement",
    "statut": "NON ENVOYER",
    "dateCreation": "2025-09-19T08:00:00Z",
    "dateModification": "2025-09-19T08:00:00Z"
  }
];
  
this.reclamations = this.reclamations.map(item => ({
    ...item,
    selected: false
  }));

this.totalPages = Math.ceil(this.reclamations.length / this.itemsPerPage);
    this.updatePaginatedList();
  }
 updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.reclamations.slice(startIndex, endIndex);
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
  if (sexe === 'm' || sexe === 'masculin' || sexe === 'male') {
    return '#2196F3'; // Bleu
  }

  // Femme
  if (sexe === 'f' || sexe === 'feminin' || sexe === 'female') {
    return '#f45187ff'; // Rose doux
  }

  return '#666'; // Valeur neutre si non défini
}
toggleSelectAll() {
  this.selectAll = !this.selectAll;
  this.reclamations.forEach(item => item.selected = this.selectAll);
}

toggleSelectOne() {
  // si tous sont cochés, selectAll = true sinon false
  this.selectAll = this.reclamations.every(item => item.selected);
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
  reclamationFiltres() {
    if (!this.searchFilterText) return this.reclamations
    const search = this.searchFilterText.toLowerCase()
    return this.reclamations.filter(item => {
      const text = (item.id + ' ' + item.description).toLowerCase()
      return text.indexOf(search) > -1
    })
  }

  showAddForm() {
    this.reclamation = new Reclamation();
    this.currentView = 'add';
  }

  showEditForm(reclamation: Reclamation) {
    this.reclamation = reclamation;
    this.currentView = 'add';
    this.reclamationService.update(this.reclamation).subscribe(ret => {
      if (ret['code'] === 200) {
        this.reclamation = ret['data'];
        this.reclamations.forEach(user => {
          if (user.id === this.reclamation.id) {
            user = this.reclamation;
          }
        });
        this.loading = false;
      } else {
        this.toast.error(ret['message']);
        this.loading = false;
      }
    }, error => {
      this.toast.info(environment.erreur_connexion_message);
      this.loading = false;
    });
  }
  showConfirmDialog(reclamation: Reclamation, action: string): void {
    this.reclamation = reclamation;
    this.dialogAction = action;
    //this.openConfirmDialog.nativeElement.click();
  }
  showDeleteDialog(reclamation: Reclamation): void {
    this.reclamation = reclamation;
    this.deleteConfirmDialog.nativeElement.click();
  }

  Search() {
    this.loading = true;
    this.reclamationService.findAll().subscribe(ret => {
      if (ret['code'] === 200) {
        this.reclamations = ret['data'];
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
  Save() {
    this.loading = true;
    this.reclamationService.save(this.reclamation).subscribe(ret => {
      if (ret['code'] === 200) {
        this.reclamation.statut='ENVOYER'
        this.reclamation = ret['data'];
        this.reclamations.push(this.reclamation);
        this.closeAddElementDialog.nativeElement.click();
        this.loading = false;
        this.toast.success("Reclamation enregistré avec succès");
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
    this.reclamationService.update(this.reclamation).subscribe(ret => {
      if (ret['code'] === 200) {
        this.reclamation = ret['data'];
        this.reclamations.forEach(prof => {
          if (prof.id === this.reclamation.id) {
            prof = this.reclamation;
          }
        });
        this.closeAddElementDialog.nativeElement.click();
        this.loading = false;
        this.toast.success("Reclamation modifié avec succès");
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

  DeleteReclamation() {
    this.loading = true;
    this.reclamationService.delete(this.reclamation).subscribe(ret => {
      if (ret['code'] === 200) {
        this.reclamation = ret['data'];
        this.reclamations.filter(pr => { return pr.id !== this.reclamation.id });
        this.deleteConfirmDialog.nativeElement.click();
        this.toast.success("Reclamation supprimé avec succès");
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
