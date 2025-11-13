import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AppToastService } from 'src/app/shared/utils/AppToast.service';
import { environment } from 'src/environments/environment';
import { AppConfig } from 'src/app/shared/utils/app-config';
import * as SecureLS from 'secure-ls';
import { Cabinet } from 'src/app/shared/models/cabinet';
import { Visiteur } from 'src/app/shared/models/visiteur';
import { CabinetService } from 'src/app/shared/services/cabinet.service';
import { RoleManager } from 'src/app/shared/utils/role-manager';
import { SearchParam } from 'src/app/shared/utils/search-param';
import { ServiceService } from 'src/app/shared/services/service.service';
import { HttpClient } from '@angular/common/http';
import { Demande } from 'src/app/shared/models/demande';
import { DemandeService } from 'src/app/shared/services/demande.service';
import { Service } from 'src/app/shared/models/service';
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-visiteur',
  templateUrl: './visiteur.component.html',
  styleUrls: ['./visiteur.component.css']
})
export class VisiteurComponent implements OnInit {
  public visiteurs: Visiteur[] = [];
  public selectedUsers: Demande[][];
  public visiteur: Demande = new Demande();
  public cabinets: Cabinet[] = [];
  public cabinetFilter = { designation: '' };
  public services: Service[] = [];
  public typeUserFilter = { designation: '' };
  public visiteures: Visiteur[] = [];
  public visiteureFilter = { nom: '' };
  public roleManager: RoleManager;
  public searchParam: SearchParam;
  public isSearch: boolean = false;
  public currentUser: any;
  public loading: boolean;
  public isDark: boolean;
  public pageTitle = 'Liste';
  // public currentPage = 'list';
  public currentView = 'list';
  public currentPage = 1;
  public searchFilterText: string = '';
  public dialogAction: string;
  public confirmPassword: string;
  public currentIndex: any = 1;
  public nombreAssistante: number = 0;
  public nombreGreffier: number = 0;
  public nombreJuge: number = 0;
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
  searchValue: any;
  paginatedList: any[] = []; // la portion affichée
  filteredVisiteurs: any[] = []; // la portion affichée
  itemsPerPage = 10; // nombre d’éléments par page
  totalPages = 0;
  selectAll: boolean = false;
  indicatifs: any = {};
  public deleteModal?: Modal;

  constructor(
    private visiteurService: DemandeService,
    private cabinetService: CabinetService,
    private typeUserService: ServiceService,
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

  getSexColor(): string {
    // Homme
    if (this.visiteur.sexe === 'Homme') {
      return '#2196F3'; // gris par défaut
    }
    // Femme
    if (this.visiteur.sexe === 'Femme') {
      return '#f45187'; // gris par défaut
    }
    // Autre ou indéfini
    return '#666';
  }

  showList() {
    this.currentView = 'list';
    this.pageTitle = 'Liste'
  }
  showAddForm() {
    this.visiteur = new Demande();
    this.findCabinets();
    this.findServices();
    this.currentView = 'add';
    this.pageTitle = 'Nouveau visiteur';
  }

  showEditForm(user: Demande) {
    this.visiteur = user;
    this.findCabinets();
    this.findServices();
    this.currentView = 'edit';
    this.pageTitle = 'Modification d\'visiteur';
  }

  showDetail(user: Demande) {
    this.visiteur = user;
    //this.currentPage = 'detail';
    this.pageTitle = 'Détails user'
  }

  showResetDialog(visiteur: Demande): void {
    this.visiteur = visiteur;
  }

  showConfirmDialog(visiteur: Demande): void {
    // this.dialogAction = action;
    this.visiteur = visiteur;
    this.openConfirmDialog.nativeElement.click();
  }
  showDeleteDialog(visiteur: Demande): void {
    this.visiteur = visiteur;
    if (this.deleteModal) {
      this.deleteModal.show();
    } else {
      console.warn("⚠️ Le modal n’a pas été initialisé.");
    }
  }
  closeDeleteDialog(): void {
    this.deleteModal?.hide();
  }

  deleteVisiteur(): void {
    if (this.visiteur) {
      this.loading = true;
      this.visiteurService.delete(this.visiteur).subscribe((ret: any) => {
        if (ret['code'] == 200) {
          this.visiteur = ret['data'];
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

  // 🔍 Recherche texte
filterVisiteurs(event: any) {
  const query = event.target.value.toLowerCase();
  this.filteredVisiteurs = this.visiteurs.filter(v =>
    v.nomComplet.toLowerCase().includes(query) ||
    v.numeroTelephone.toLowerCase().includes(query) ||
    v.fonction.toLowerCase().includes(query) ||
    v.adresse.toLowerCase().includes(query)||
    v.typePiece.toLowerCase().includes(query)||
    v.numeroPiece.toLowerCase().includes(query)
  );

  this.totalPages = Math.ceil(this.filteredVisiteurs.length / this.itemsPerPage);
  this.currentPage = 1;
  this.updatePaginatedList();
}
  // 🔹 Charger tous les visiteurs
search() {
  this.loading = true;
  this.visiteurService.findAllVisiteur().subscribe({
    next: (ret) => {
      this.loading = false;
      if (ret['code'] === 200 && ret['data'] && Array.isArray(ret['data'].data)) {
        // ✅ Récupération correcte de la liste paginée
        const visiteursList = ret['data'].data;
        // ✅ Ajout du champ "selected" pour la sélection
        this.visiteurs = visiteursList.map((p: any) => ({ ...p, selected: false }));
        // ✅ Copie pour le filtrage et l’affichage initial
        this.filteredVisiteurs = [...this.visiteurs];
        // ✅ Pagination
        this.totalPages = Math.ceil(this.filteredVisiteurs.length / this.itemsPerPage);
        this.currentPage = 1;
        this.updatePaginatedList();
      } else {
        this.toast.error(ret['message'] || "Données invalides reçues");
      }
    },
    error: () => {
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
    }
  });
}

  // 🔹 Mettre à jour la liste paginée à partir de filteredVisiteurs
  updatePaginatedList() {
    if (!this.filteredVisiteurs || this.filteredVisiteurs.length === 0) {
      this.paginatedList = [];
      this.totalPages = 0;
      return;
    }

    this.totalPages = Math.ceil(this.filteredVisiteurs.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.filteredVisiteurs.slice(startIndex, endIndex);
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
    this.visiteurs.forEach(item => item.selected = this.selectAll);
  }

  toggleSelectOne() {
    // si tous sont cochés, selectAll = true sinon false
    this.selectAll = this.visiteurs.every(item => item.selected);
  }
  Save() {
    this.currentUser.service_name;
    // this.visiteur.image = null;
    this.loading = true;
    this.visiteurService.save(this.visiteur).subscribe(ret => {
      if (ret['code'] === 200) {
        this.visiteur = ret['data'];
        this.closeAddElementDialog.nativeElement.click();
        this.toast.success("Demande ajouté avec succès");
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
    /* this.visiteur.cabinet_id = this.visiteur.cabinet.id;
    this.visiteur.typeUser_id = this.visiteur.typeUser.id;
    this.visiteur.visiteur_id = this.visiteur.visiteur.id; */
    this.visiteurService.update(this.visiteur).subscribe(ret => {
      if (ret['code'] === 200) {
        this.visiteur = ret['data'];

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

  UpdateStatut(statut: string) {
    this.loading = true;
    this.visiteur.statut = statut;

    this.visiteurService.updateStatut(this.visiteur).subscribe(
      ret => {
        if (ret['code'] === 200) {
          this.visiteur = ret['data'];

          // MAJ dans la liste locale
          this.visiteurs.forEach(user => {
            if (user.id === this.visiteur.id) {
              user.statut = this.visiteur.statut;
            }
          });

          // ✅ Fermer la modale Bootstrap via jQuery
          (('#userConfirmModal') as any).modal('hide');

          // Toast de succès
          this.toast.success("Statut mis à jour avec succès.");

          this.showList();
        } else {
          this.toast.error(ret['message']);
        }
        this.loading = false;
      },
      error => {
        this.toast.error(environment.erreur_connexion_message);
        this.loading = false;
      }
    );
  }


  findCabinets() {
    this.cabinetService.findAll().subscribe(ret => {
      if (ret['code'] === 200) {
        this.cabinets = ret['data'];
        if (this.currentView === 'edit' || this.currentView === 'detail' && this.visiteur.cabinet && this.cabinets.length > 0) {
          this.visiteur.cabinet = this.cabinets.find(p => p.id === this.visiteur.cabinet.id)
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
    this.typeUserService.findAll().subscribe(ret => {
      if (ret['code'] === 200) {
        this.services = ret['data'];
        if (this.currentView === 'edit' || this.currentView === 'detail' && this.visiteur.service_id && this.services.length > 0) {
          this.visiteur.service = this.services.find(p => p.id === this.visiteur.service_id)
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
  deleteImageVisiteure() {
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
      //this.imageVisiteure = (readerEvent.target as any).result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  /* +++++++++++++++++++++++++ new code for signature++++++++++++++++++ */
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private drawing = false;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#000';

    canvas.addEventListener('mousedown', this.startDrawing);
    canvas.addEventListener('mouseup', this.stopDrawing);
    canvas.addEventListener('mouseout', this.stopDrawing);
    canvas.addEventListener('mousemove', this.draw);
  }

  startDrawing = (event: MouseEvent) => {
    this.drawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(event.offsetX, event.offsetY);
  };

  stopDrawing = () => {
    this.drawing = false;
    this.ctx.closePath();
  };

  draw = (event: MouseEvent) => {
    if (!this.drawing) return;
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
  };

  saveSignature() {
    const dataURL = this.canvasRef.nativeElement.toDataURL('image/png');
    console.log('Signature sauvegardée : ', dataURL);
    alert('Signature enregistrée avec succès ✅');
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
