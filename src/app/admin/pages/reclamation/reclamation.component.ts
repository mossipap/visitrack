import { Component, OnInit, ViewChild } from '@angular/core';
import { AppConfig } from 'src/app/shared/utils/app-config';
import { AppToastService } from 'src/app/shared/utils/AppToast.service';
import * as SecureLS from 'secure-ls';
import { environment } from 'src/environments/environment';
import { RoleManager } from 'src/app/shared/utils/role-manager';
import { SearchParam } from 'src/app/shared/utils/search-param';
import { Reclamation } from 'src/app/shared/models/reclamation ';
import { ReclamationService } from 'src/app/shared/services/reclamation.service';
import { Utilisateur } from 'src/app/shared/models/utilisateur';
import { DemandeService } from 'src/app/shared/services/demande.service';
import { Visiteur } from 'src/app/shared/models/visiteur';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent implements OnInit {
  public reclamation: Reclamation;
  public reclamations: Reclamation[] = [];
  public visiteurs: Visiteur[] = [];
  public droitFilter: any = { nom: '' }
  public roleManager: RoleManager;
  public searchParam: SearchParam;
  public currentUser: Utilisateur;
  public dialogAction: string;
  public searchFilterText: string = '';
  public loading: boolean;
  public isDark: boolean;

  @ViewChild('closeAddElementDialog') closeAddElementDialog: any;
  @ViewChild('openConfirmDialog') openConfirmDialog: any;
  @ViewChild('deleteConfirmDialog') deleteConfirmDialog: any;
  paginatedList: any[] = []; // la portion affichée
  itemsPerPage = 10; // nombre d’éléments par page
  totalPages = 0;
  selectAll: boolean = false;
  filteredReclamations: any[] = [];
  public currentView = 'list';
  public currentPage = 1; 
  selectedVisiteur: any = null;
  constructor(
    private reclamationService: ReclamationService,
    private visiteurService: DemandeService,
    private toast: AppToastService,
    private appConfig: AppConfig
  ) {
    this.currentUser = this.appConfig.currentUser;
    this.roleManager = new RoleManager();
    this.searchParam = new SearchParam();
  }

  ngOnInit(): void {
    const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: 'MyAdminApp' });
  this.Search();
 
  }
  showAddForm() {
    this.reclamation = new Reclamation();
    this.currentView = 'add';
    this.findVisiteurs()
  }
  showEditForm(reclamation: Reclamation) {
    this.reclamation = reclamation;
    this.currentView = 'add';
    this.findVisiteurs()
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
  
 findVisiteurs() {
    this.visiteurService.findAllVisiteur().subscribe(ret => {
      if (ret['code'] === 200) {
        this.visiteurs = ret['data'].data;
        //console.log("errovisiteursr===>", this.visiteurs);
        if (this.currentView === 'add' || this.currentView === 'detail' && this.reclamation.visiteur && this.visiteurs.length > 0) {
          this.reclamation.visiteur = this.visiteurs.find(p => p.id === this.reclamation.visiteur.id)
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

  Save() {
    this.loading = true;
     this.reclamation.user_id = this.currentUser.id
      this.reclamation.statut='EN_COURS'
    this.reclamationService.save(this.reclamation).subscribe(ret => {
      if (ret['code'] === 200) {
        this.reclamation = ret['data'];
        this.reclamations.push(this.reclamation);
        this.closeAddElementDialog.nativeElement.click();
        this.loading = false;
        this.toast.success("Reclamation enregistré avec succès");
        this.Search();
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
        this.Search();
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
        this.closeModal('deleteModal');   // 🔥 Ferme automatiquement le modal
        this.toast.success("Reclamation supprimé avec succès");
        this.Search();
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

showDeletedDialog(r: Reclamation) {
  this.reclamation = r;
}
showRecupererDialog(r: Reclamation) {
  this.reclamation = r;
}
closeModal(id: string) {
  const modalEl = document.getElementById(id);
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
}
getStatusClass(status: string) {
  switch (status) {
    case 'En cours d\'investigation':
      return 'bg-warning text-dark';
    case 'Objet retrouvé':
      return 'bg-success';
    case 'En attente de restitution':
      return 'bg-primary';
    case 'Restitué':
      return 'bg-info';
    case 'Clôturé sans suite':
      return 'bg-secondary';
    default:
      return 'bg-light text-dark';
  }
}
RetirerObjet() {
  this.loading = true;
    this.reclamationService.updateStatut(this.reclamation).subscribe(ret => {
      if (ret['code'] === 200) {
        this.reclamation = ret['data'];
        this.reclamations.filter(pr => { return pr.id !== this.reclamation.id });
        this.closeModal('restoreModal');   // 🔥 Ferme automatiquement le modal
        this.toast.success("Reclamation supprimé avec succès");
        this.Search();
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
  // 🔍 Recherche texte
reclamationFiltres() {
  const term = this.searchFilterText.toLowerCase().trim();
  // Si le champ est vide => on réinitialise
  if (!term) {
    this.filteredReclamations = [...this.reclamations];
  } else {
    this.filteredReclamations = this.reclamations.filter(R =>
      R.visiteur.nomComplet?.toLowerCase().includes(term) ||
      R.texte?.toLowerCase().includes(term)||
      R.visiteur.numeroTelephone?.toLowerCase().includes(term)
    );
  }

  this.currentPage = 1; // retour page 1
  this.updatePaginatedList();
}

// 🔹 Charger tous les reclamations
Search() {
  this.loading = true;
  this.reclamationService.findAll().subscribe({
    next: (ret) => {
      this.loading = false;
      if (ret['code'] === 200) {
        // Ajouter selected et initialiser filteredReclamations
        this.reclamations = ret['data'].data.map((p: any) => ({ ...p, selected: false }));
        this.filteredReclamations = [...this.reclamations]; // ✅ important

        this.totalPages = Math.ceil(this.filteredReclamations.length / this.itemsPerPage);
        this.currentPage = 1;
        this.updatePaginatedList();
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

// 🔹 Mettre à jour la liste paginée à partir de filteredReclamations
updatePaginatedList() {
  if (!this.filteredReclamations || this.filteredReclamations.length === 0) {
    this.paginatedList = [];
    this.totalPages = 0;
    return;
  }

  this.totalPages = Math.ceil(this.filteredReclamations.length / this.itemsPerPage);
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedList = this.filteredReclamations.slice(startIndex, endIndex);
  //console.log("+++++ paginatedList reçues +++++", this.paginatedList);
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
  this.reclamations.forEach(item => item.selected = this.selectAll);
}
toggleSelectOne() {
  // si tous sont cochés, selectAll = true sinon false
  this.selectAll = this.reclamations.every(item => item.selected);
}

}
