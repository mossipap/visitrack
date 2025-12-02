import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppToastService } from 'src/app/shared/utils/AppToast.service';
import { RoleManager } from 'src/app/shared/utils/role-manager';
import { AppConfig } from 'src/app/shared/utils/app-config';
import { environment } from 'src/environments/environment';
import { SearchParam } from 'src/app/shared/utils/search-param';
import { Droit } from 'src/app/shared/models/droit';
import { ProfileService } from 'src/app/shared/services/profil.service';
import * as SecureLS from 'secure-ls';
import { Utilisateur } from 'src/app/shared/models/utilisateur';
import { Modal } from 'bootstrap';
import { Profil } from 'src/app/shared/models/profil';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  public profil: Profil;
  public profils: Profil[] = [];
  public selectedProfils: Profil[]
  public droits: Droit[] = [];
  public droitFilter: any = { nom: '' }
  public roleManager: RoleManager;
  public searchParam: SearchParam;
  public isSearch: boolean = false;
  public currentUser: Utilisateur;
  public currentPage: any = 'list';
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
  @ViewChild('openDeleteDialog') openDeleteDialog: ElementRef;
  private deleteModal?: Modal;
  searchValue: any;
  paginatedList: any[] = []; // la portion affichée
  itemsPerPage = 10; // nombre d’éléments par page
  totalPages = 0;
  selectAll: boolean = false;
  filteredProfils: any[] = [];
  constructor(
    private profilService: ProfileService,
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
  profilFiltres2() {
    if (!this.searchFilterText) return this.profils
    const search = this.searchFilterText.toLowerCase()
    return this.profils.filter(item => {
      const text = (item.id + ' ' + item.nom).toLowerCase()
      return text.indexOf(search) > -1
    })
  }
 
  showAddForm() {
    this.profil = new Profil();
    this.initDroits();
    this.currentPage = 'add';
  }

  showEditForm(profil: Profil) {
    this.profil = profil;
    this.currentPage = 'add';
    this.profilService.findDroitByProfilId(this.profil.id).subscribe(ret => {
      if (ret['code'] === 200) {
        this.droits = ret['Droits'];
       // console.log("droits===>", this.droits);
        this.droits.forEach(d => { d.checked = true });
        const otherRights = ret['TousDroits'];
        otherRights.forEach((orth: any) => {
          const droit = this.droits.find((d)=> d.id === orth.id);
          if (droit === undefined) {
            this.droits.push(orth);
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
  showConfirmDialog(profil: Profil, action: string): void {
    this.profil = profil;
    this.dialogAction = action;
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

  showDeleteDialog(profil: Profil): void {
    this.profil = profil;
    if (this.deleteModal) {
      this.deleteModal.show();
    } else {
      console.warn("⚠️ Le modal n’a pas été initialisé.");
    }
  }
  closeDeleteDialog(): void {
    this.deleteModal?.hide();
  }
DeleteProfile() {
  this.loading = true;
  this.profil.user_id = this.currentUser.id
  //console.log('+++++++++++++ profile ++++++++++++',this.profil)
    this.profilService.delete(this.profil).subscribe(ret => {
      if (ret['code'] === 200) {
        this.profil = ret['data'];
        this.profils.filter(pr => { return pr.id !== this.profil.id});
        this.closeDeleteDialog();
        this.Search();
        this.toast.success("Profil supprimé avec succès");
         // console.log('+++++++++++++ profile ++++++++++++',this.profil)

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
// 🔎 Filtrer les profils selon le texte
// 🔍 Recherche texte
profilFiltres() {
  const term = this.searchFilterText.toLowerCase().trim();
  // Si le champ est vide => on réinitialise
  if (!term) {
    this.filteredProfils = [...this.profils];
  } else {
    this.filteredProfils = this.profils.filter(p =>
      p.nom?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    );
  }

  this.currentPage = 1; // retour page 1
  this.updatePaginatedList();
}

// 🔹 Charger tous les profils
Search() {
  this.loading = true;
  this.profilService.findAll().subscribe({
    next: (ret) => {
      this.loading = false;
      if (ret['code'] === 200) {
        // Ajouter selected et initialiser filteredProfils
        this.profils = ret['data'].map((p: any) => ({ ...p, selected: false }));
        this.filteredProfils = [...this.profils]; // ✅ important

        this.totalPages = Math.ceil(this.filteredProfils.length / this.itemsPerPage);
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

// 🔹 Mettre à jour la liste paginée à partir de filteredProfils
updatePaginatedList() {
  if (!this.filteredProfils || this.filteredProfils.length === 0) {
    this.paginatedList = [];
    this.totalPages = 0;
    return;
  }

  this.totalPages = Math.ceil(this.filteredProfils.length / this.itemsPerPage);
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedList = this.filteredProfils.slice(startIndex, endIndex);
  console.log("+++++ paginatedList reçues +++++", this.paginatedList);
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
  this.profils.forEach(item => item.selected = this.selectAll);
}

toggleSelectOne() {
  // si tous sont cochés, selectAll = true sinon false
  this.selectAll = this.profils.every(item => item.selected);
}
  Save() {
    if (this.droits) {
      this.profil.droits = []
      this.droits.forEach(d => {
        if (d.checked !== undefined && d.checked) {
          this.profil.droits.push(d)
        }
      })
    }
    if (this.profil.droits.length === 0) {
      this.toast.warning('Veuillez selectionner au moins 1 droit');
      return
    }
    this.loading = true;
    this.profil.user_id = this.currentUser.id
    this.profilService.save(this.profil).subscribe(ret => {
      if (ret['code'] === 200) {
        this.profil = ret['data'];
        this.profils.push(this.profil);
        this.closeAddElementDialog.nativeElement.click();
        this.loading = false;
        this.toast.success("Profil enregistré avec succès");
      } else {
        this.loading = false;
        this.toast.error(ret['message']);
      }
      this.loading = false;
    }, error => {
      console.log("error===>", error);
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
    });
  }
  
  Update() {
    if (this.droits) {
      this.profil.droits = []
      this.droits.forEach(d => {
        if (d.checked !== undefined && d.checked) {
          this.profil.droits.push(d)
        }
      })
    }
    if (this.profil.droits.length === 0) {
      this.toast.warning('Veuillez selectionner au moins 1 droit');
      return
    }
    this.loading = true;
    this.profil.user_id = this.currentUser.id
    this.profilService.update(this.profil).subscribe(ret => {
      if (ret['code'] === 200) {
        this.profil = ret['data'];
        this.profils.forEach(prof => {
          if (prof.id === this.profil.id) {
            prof = this.profil;
          }
        });
        this.closeAddElementDialog.nativeElement.click();
        this.loading = false;
        this.toast.success("Profil modifié avec succès");
      } else {
        this.loading = false;
        this.toast.error(ret['message']);
      }
      this.loading = false;
    }, error => {
      console.log("error===>", error);
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
    });
  }
  Activer() {
    this.loading = true;
    this.profil.user_id = this.currentUser.id
    this.profil.statut;
    this.profilService.activer(this.profil).subscribe(ret => {
      if (ret['code'] === 200) {
        this.profil = ret['data'];
        this.profils.forEach(user => {
          if(user.id === this.profil.id){
            user.statut = this.profil.statut;
          }
        });
        this.openConfirmDialog.nativeElement.click();
        this.toast.success("Profil statut changé avec succès");
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
  Desactiver() {
    this.loading = true;
    this.profil.user_id = this.currentUser.id
    this.profil.statut;
    this.profilService.desactiver(this.profil).subscribe(ret => {
      if (ret['code'] === 200) {
        this.profil = ret['data'];
        this.profils.forEach(user => {
          if(user.id === this.profil.id){
            user.statut = this.profil.statut;
          }
        });
        this.openConfirmDialog.nativeElement.click();
        this.toast.success("Profil statut changé avec succès");
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

  initDroits() {
    this.profilService.findAllDroit().subscribe((ret) => {
      if (ret['code'] === 200) {
        this.droits = ret['data'];
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
  // check or uncheck roles
  checkedAllRole() {
    this.droits.forEach(r => {
      r.checked = this.isSelectedRole;
    });
  }
}
