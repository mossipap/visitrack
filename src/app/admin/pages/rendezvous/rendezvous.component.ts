import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { AppToastService } from 'src/app/shared/utils/AppToast.service';
import { environment } from 'src/environments/environment';
import { AppConfig } from 'src/app/shared/utils/app-config';
import * as SecureLS from 'secure-ls';
import { Cabinet } from 'src/app/shared/models/cabinet';
import { Profil } from 'src/app/shared/models/profil';
import { CabinetService } from 'src/app/shared/services/cabinet.service';
import { RoleManager } from 'src/app/shared/utils/role-manager';
import { SearchParam } from 'src/app/shared/utils/search-param';
import { Demande } from 'src/app/shared/models/demande';
import { DemandeService } from 'src/app/shared/services/demande.service';
import { HttpClient } from '@angular/common/http';
import { Service } from 'src/app/shared/models/service';
import { ServiceService } from 'src/app/shared/services/service.service';
import { Modal } from 'bootstrap';
declare var bootstrap: any;
@Component({
  selector: 'app-rendezvous',
  templateUrl: './rendezvous.component.html',
  styleUrls: ['./rendezvous.component.css']
})
export class RendezvousComponent implements OnInit {
 public demandes: Demande[] = [];
  public allList: any[] = [];
  public activeList: any[] = [];
  public bloqueList: Demande[] = [];
  public suppriList: Demande[] = [];
  public selectedUsers: Demande[] [];
  public demande: Demande = new Demande();
  public visiteur: Demande = new Demande();
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
  public step: number = 1;
  public criteriaList = [
    { name: 'Prénom et nom' },
    { name: 'Fonction' },
    { name: 'Telephone' },
    { name: 'Cabinet' }
  ];
  @ViewChild('openConfirmDialog') openConfirmDialog: any;
  @ViewChild('deleteConfirmDialog') deleteConfirmDialog: any;
  @ViewChild('closeAddElementDialog') closeAddElementDialog: any;
  @ViewChild('fileInputUpload', { static: false }) fileInputUpload: ElementRef;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  signatureImage: string | null = null;
  paginatedList: any[] = []; // la portion affichée
  itemsPerPage = 10; // nombre d’éléments par page
  totalPages = 0;
  selectAll: boolean = false;
  public currentView = 'list';
  public currentPage = 1; 
  indicatifs: any = {};
  public isNumberPhone: boolean ;
  public deleteModal?: Modal;

modalInstance: any;
  
  constructor(
    private demandeService: DemandeService,
    private cabinetService: CabinetService,
    private serviceService: ServiceService,
    private toast: AppToastService,
    private appConfig: AppConfig,
    private http: HttpClient
  ) {
    this.currentUser = this.appConfig.currentUser;
    this.roleManager = new RoleManager();
    this.searchParam = new SearchParam();
  }

  ngOnInit(): void {
    const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: 'MyAdminApp' });
    this.searchParam.dateFin.setDate(this.searchParam.dateFin.getDate() + 1);
    this.search();


   this.loadIndicatifs();
  }

  loadIndicatifs() {
    this.http.get('assets/indicatifs.json').subscribe(
      (data) => {
        this.indicatifs = data;
      },
      (error) => {
        console.error('Erreur chargement indicatifs', error);
      }
    );
  }

  getFlag(numero: string): string {
    if (!numero) return '';
    const code = Object.keys(this.indicatifs).find((prefix) =>
      numero.startsWith(prefix)
    );
    return code ? this.indicatifs[code] : '🌍';
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

  showList() {
    this.currentView = 'list';
    this.pageTitle = 'Liste'
  }
  showAddForm() {
    this.demande = new Demande();
    this.findCabinets();
    this.findServices();
    this.currentView = 'add';
    this.pageTitle = 'Nouveau demande';
    this.searchParam.query = ""
  }

  showEditForm(user: Demande) {
    this.demande = user;
    this.findCabinets();
    this.findServices();
    this.currentView = 'edit';
    this.pageTitle = 'Modification d\'demande';
  }

  showDetail(user: Demande) {
    this.demande = user;
    //this.currentView = 'detail';
    this.pageTitle = 'Détails user'
  }

  showResetDialog(demande: Demande): void {
    this.demande = demande;
  }

  showConfirmDialog(demande: Demande): void {
   // this.dialogAction = action;
    this.demande = demande;
    this.openConfirmDialog.nativeElement.click();
  }

  // 🔹 Ouvrir la modale


 showDeleteDialog(demande: Demande): void {
    this.demande = demande;
    if (this.deleteModal) {
      this.deleteModal.show();
    } else {
      console.warn("⚠️ Le modal n’a pas été initialisé.");
    }
  }
  closeDeleteDialog(): void {
    this.deleteModal?.hide();
  }
search() {
  this.loading = true;
  this.demandeService.findAll().subscribe(
    (ret) => {
      this.loading = false;
      if (ret['code'] == 200) {
        this.demandes = ret['data']['data'];

        // Séparer les listes
        this.activeList = this.demandes.filter(d => d.statut === 'En cours');
        this.bloqueList = this.demandes.filter(d => d.statut === 'Terminée');
        this.suppriList = this.demandes.filter(d => d.statut === 'Supprimé');

        // ✅ Tout afficher par défaut
        this.allList = [...this.demandes];

        // Calcul pagination
        this.totalPages = Math.ceil(this.allList.length / this.itemsPerPage);
        this.updatePaginatedList();

        this.toast.info(`${this.demandes.length} demande(s) trouvée(s)`);
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
    (item.visiteur.nomComplet + ' ' + item.numeroTelephone + ' ' + item.cabinet?.numerocabinet)
      .toLowerCase()
      .includes(search)
  );
}

activeFiltres() {
  if (!this.searchFilterText) return this.activeList;
  const search = this.searchFilterText.toLowerCase();
  return this.activeList.filter(item =>
    (item.nomComplet + ' ' + item.numeroTelephone + ' ' + item.cabinet?.numerocabinet)
      .toLowerCase()
      .includes(search)
  );
}

bloqueFiltres() {
  if (!this.searchFilterText) return this.bloqueList;
  const search = this.searchFilterText.toLowerCase();
  return this.bloqueList.filter(item =>
    (item.nomComplet + ' ' + item.numeroTelephone).toLowerCase().includes(search)
  );
}

supprimeFiltres() {
  if (!this.searchFilterText) return this.suppriList;
  const search = this.searchFilterText.toLowerCase();
  return this.suppriList.filter(item =>
    (item.nomComplet + ' ' + item.numeroTelephone).toLowerCase().includes(search)
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
  this.demande.statut = "En_attente";
  this.currentUser = this.demande.user_id;
 // this.demande.user_personnel_id = null;
  //this.demande.visiteur_id = null;
  this.loading = true;

  this.demandeService.save(this.demande).subscribe(ret => {
    if (ret['code'] === 200) {

      this.demande = ret['data'];

      // ✅ Sécurisation ici
      if (!Array.isArray(this.demandes)) {
        this.demandes = [];
      }

      this.demandes.push(this.demande);

      this.closeAddElementDialog.nativeElement.click();
      this.toast.success("Demande ajoutée avec succès");

      this.search(); // Recharge les listes
      this.showList();
    } else {
      this.toast.error(ret['message']);
    }
    this.loading = false;
  }, error => {
    this.toast.error(environment.erreur_connexion_message);
    this.loading = false;
  });
}


  Update() {
    this.loading = true;
    /* this.demande.cabinet_id = this.demande.cabinet.id;
    this.demande.service_id = this.demande.service.id;
    this.demande.profil_id = this.demande.profil.id; */
    this.demande.statut = 'Terminée'
    this.demandeService.update(this.demande).subscribe(ret => {
      if (ret['code'] === 200) {
        this.demande = ret['data'];
        this.demandes.forEach(user => {
          if(user.id === this.demande.id) {
            user = this.demande;
          }
        });
        this.closeAddElementDialog.nativeElement.click();
        this.toast.success("Demande modifié avec succès");
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

  deleteDemande(): void {
    if (this.demande) {
      console.log(`Suppression de ${this.demande.visiteur.nomComplet}`);
       this.loading = true;
      this.demandeService.delete(this.demande).subscribe((ret:any) => {
       if (ret['code'] == 200) {
         this.demande = ret['data'];
         this.closeDeleteDialog();
          this.search();
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
  findCabinets() {
    this.cabinetService.findAll().subscribe(ret => {
      if (ret['code'] === 200) {
        this.cabinets = ret['data'];
        if (this.currentView === 'edit' || this.currentView === 'detail' && this.demande.cabinet && this.cabinets.length > 0) {
          this.demande.cabinet = this.cabinets.find(p => p.id === this.demande.cabinet.id)
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

  findServices() {
    this.serviceService.findAll().subscribe(ret => {
      if (ret['code'] === 200) {
        this.services = ret['data'];
        if (this.currentView === 'edit' || this.currentView === 'detail' && this.demande.service_id && this.services.length > 0) {
          this.demande.service = this.services.find(p => p.id === this.demande.service_id)
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
  

 searchVisiteurByNumber(numberPhone: string) {
  console.log("query ===>", numberPhone);
  this.loading = true;

  this.demandeService.findByNumero(this.searchParam).subscribe({
    next: (ret) => {
      this.loading = false;
      if (ret['code'] === 200) {
        // ✅ Numéro trouvé → on remplit le formulaire
        this.demande = ret['data'];
        this.toast.success("Visiteur trouvé avec succès");
        this.isNumberPhone = true; // On affiche le formulaire pré-rempli
      } 
      else if (ret['code'] === 404) {
        // ⚠️ Numéro non trouvé → on affiche le formulaire vide
        this.toast.warning("Aucun visiteur trouvé. Vous pouvez remplir le formulaire.");
        this.isNumberPhone = true; // On affiche quand même le formulaire
         //this.demande = new Demande(); // Formulaire vide avec numéro déjà saisi
         this.showAddForm();
      } 
      else {
        this.toast.error(ret['message'] || "Erreur inconnue");
        this.isNumberPhone = false;
      }
    },
    error: () => {
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
      this.isNumberPhone = false;
    }
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

  /* +++++++++++++++++++++++++ new code for signature++++++++++++++++++ */
    ngAfterViewInit() {
    const canvas = this.canvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    canvas.addEventListener('mousemove', this.draw.bind(this));
    canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
  }

  startDrawing(event: MouseEvent) {
    this.drawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(event.offsetX, event.offsetY);
  }

  draw(event: MouseEvent) {
    if (!this.drawing) return;
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  stopDrawing() {
    this.drawing = false;
  }

  clearSignature() {
    const canvas = this.canvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.signatureImage = null;
  }

  saveSignature() {
    this.signatureImage = this.canvas.nativeElement.toDataURL('image/png');
    console.log('Signature enregistrée :', this.signatureImage);
    alert('Signature sauvegardée avec succès ✅');
  }
  goToRecap() {
  this.signatureImage = this.canvas.nativeElement.toDataURL('image/png');
  this.step = 3;
}
formatPhone(numero: string): string {
  if (!numero) return '';
  // Exemple simple pour Mali
  if (numero.startsWith('+223')) {
    return numero.replace(/(\+223)(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  return numero;
}
}
