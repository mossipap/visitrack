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
import html2canvas from 'html2canvas';
import { DomSanitizer } from '@angular/platform-browser';
import { Editor } from 'ngx-editor';
import { Indicatifs, Nationalites } from 'src/app/shared/models/nationalite';

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
  public selectedUsers: Demande[][];
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
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  signatureImage: string | null = null;
  paginatedList: any[] = []; // la portion affichée
  itemsPerPage = 10; // nombre d’éléments par page
  selectAll: boolean = false;
  public currentView = 'list';
  public currentPage = 1;
  indicatifs: any = {};
  public isNumberPhone: boolean;
  public deleteModal?: Modal;
  modalInstance: any;
  previewUrl: any | null = null;
  editor!: Editor;
  editor1!: Editor;
  indicatifsJson: any = {};
  indicatifsAdds: { country: string, dial: string, flag: string }[] = [];
  selectedIndicatif: { country: string, dial: string, flag: string };
  phoneNumber: string = '';
  // Liste des objets possibles
  objetOptions = [
    { id: 1, label: 'Téléphone portable', checked: false },
    { id: 2, label: 'Pièce d\'identité', checked: false },
    { id: 3, label: 'Ordinateur / Tablette', checked: false },
    { id: 4, label: 'Objets dangereux', checked: false },
    { id: 5, label: 'Autres objets', checked: false }
  ];
  // Liste des objets possibles
  objetRetireOptions = [
    { id: 1, label: 'Téléphone portable', checked: false },
    { id: 2, label: 'Pièce d\'identité', checked: false },
    { id: 3, label: 'Ordinateur / Tablette', checked: false },
    { id: 4, label: 'Objets dangereux', checked: false },
    { id: 5, label: 'Autres objets', checked: false }
  ];
  sexeOptions = [
    { label: 'Homme', value: 'Homme' },
    { label: 'Femme', value: 'Femme' }
  ];
  typePieceOptions = [
    { label: 'Carte d’identité', value: 'CNI' },
    { label: 'Permis', value: 'Permis' },
    { label: 'Passeport', value: 'Passeport' },
    { label: 'Catre Scolaire', value: 'Carte Scolaire' }
  ];
  nationalites = Nationalites;
  indicatifsNums = Indicatifs;
   public indicatif1: any ;
   public indicatif2: any ;
  statutOptions = [
    { label: 'En attente', value: 'En attente' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Confirmé', value: 'Confirmé' },
    { label: 'Expiré', value: 'Expiré' },
    { label: 'Terminé', value: 'Terminé' },
  ];
  /* ±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±± */
  page = 1;
  totalPages = 0;
  pageSize = 10;// nombre d’éléments par page
  constructor(
    private demandeService: DemandeService,
    private cabinetService: CabinetService,
    private serviceService: ServiceService,
    private toast: AppToastService,
    private appConfig: AppConfig,
    private http: HttpClient,
    private sanitizer: DomSanitizer

  ) {
    this.currentUser = this.appConfig.currentUser;
    this.roleManager = new RoleManager();
    this.searchParam = new SearchParam();
  }

  ngOnInit(): void {
    const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: 'MyAdminApp' });
    this.searchParam.dateFin.setDate(this.searchParam.dateFin.getDate() + 1);
    this.editor = new Editor();
    this.editor1 = new Editor();
    this.search();
    this.searchParam.criteria === '1'
    console.log("+++++++++++++++=+++++++++current user+++++++++++++",this.currentUser)
  }
   onChangeCritere() {
    if(this.searchParam.criteria === '3') {
      this.findCabinets();
    }
    if(this.searchParam.criteria === '4') {
      this.findServices();
    }
  }
  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
    this.editor1.destroy();
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
    this.demande = new Demande();
    this.findCabinets();
    this.findServices();
    this.currentView = 'add';
    this.pageTitle = 'Nouveau demande';
    this.searchParam.query = ""
    this.demande.indicatif = this.indicatifsNums.find(i => i.value === '+225')  // ← valeur par défaut
    this.indicatif1= this.indicatifsNums.find(i => i.value === '+225')  // ← valeur par défaut
    this.indicatif2 = this.indicatifsNums.find(i => i.value === '+225')  // ← valeur par défaut
  }

  showEditForm(dem: Demande) {
    this.demande = dem;
    this.demande.dateVisite = new Date(dem.dateVisite);
    this.demande.dateExepiration = new Date(dem.dateExepiration);
    this.demande.dateDelivrance = new Date(dem.dateDelivrance);
    this.findCabinets();
    this.findServices();
    this.currentView = 'edit';
    this.pageTitle = 'Modification d\'demande';
  }
  showSignature(dem: Demande) {
    this.demande = dem;
    this.findCabinets();
    this.findServices();
    this.currentView = 'signature';
  }

  showDetail(d: Demande) {
    this.demande = d;
    //console.log('+++++++++++ detail++++++++++++',this.demande)
    // PDF en dur
    const filePath = "assets/images/piece.pdf";
    // Sécurisation Angular obligatoire
    this.demande.pieceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(filePath);
    this.currentView = 'detail';
  }

  // Ouvrir le modal d'aperçu
  openPreview(url: string) {
    this.previewUrl = url;
    const modalElement = document.getElementById('previewModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Télécharger le fichier
  downloadPiece(url: string) {
    if (!url) return;
    // Assurer URL absolue
    const baseUrl = window.location.origin; // http://localhost:4200
    const fileUrl = 'http://localhost:4200/assets/images/piece.pdf';
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `PieceIdentite_${this.visiteur.nomComplet}${fileUrl.substring(fileUrl.lastIndexOf('.'))}`;
    link.click();
  }

  // Impression de la fiche
  printPage() {
    const element = document.getElementById('print-section');
    if (!element) return;

    // Capture l'élément en image
    html2canvas(element, { scale: 2 }).then(canvas => {
      // Convertir en image
      const imgData = canvas.toDataURL('image/png');

      // Créer une nouvelle fenêtre pour impression
      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (printWindow) {
        printWindow.document.write(`
         <html>
           <head>
             <title>Impression</title>
             <style>
               body { margin: 0; padding: 20px; text-align: center; }
               img { max-width: 100%; }
             </style>
           </head>
           <body>
             <img src="${imgData}" />
             <script>
               window.onload = function() { window.print(); window.close(); }
             </script>
           </body>
         </html>
       `);
        printWindow.document.close();
      }
    });
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
        console.log("🧑‍💼 CurrentUser :", this.currentUser);

        this.demandes = ret['data']['data'];
        console.log("📦 Total avant filtrage :", this.demandes.length);
        // 🔥 Filtrage conditionnel
        if (this.currentUser.profil.id !== 1) {
          this.demandes = this.demandes.filter((d: any) => {
            return (
              d.service_id === this.currentUser.service_id ||
              d.cabinet_id === this.currentUser.cabinet_id
            );
          });
        }

        console.log("🎯 Total après filtrage :", this.demandes.length);

        // 🔥 Conversion téléphone
        this.demandes = this.demandes.map((d: any) => ({
          ...d,
          visiteur: d.visiteur
            ? {
                ...d.visiteur,
                numeroTelephone: d.visiteur.numeroTelephone
                  ? d.visiteur.numeroTelephone.replace(/^00/, '+')
                  : null
              }
            : null
        }));

        // 📌 Séparation des listes
        this.activeList = this.demandes.filter(d => d.statut === 'En_attente');
        this.bloqueList = this.demandes.filter(d => d.statut === 'Terminée');
        this.suppriList = this.demandes.filter(d => d.statut === 'Supprimé');

        this.allList = [...this.demandes];
        this.updatePaginatedList();

        this.toast.info(`${this.demandes.length} demande(s) trouvée(s)`);
      } 
      else {
        this.toast.error(ret['message']);
      }
    },

    () => {
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
    }
  );
}


onPageChange(page: number) {
    this.page = page;
  }
  updatePaginatedList() {
    let sourceList: any[] = [];
    // 🟢 Choisir la liste selon le filtre actif
    switch (this.currentIndex) {
      case 1:
        sourceList = this.allFiltres();
        break;
      case 2:
        sourceList = this.activeFiltres();
        break;
      case 3:
        sourceList = this.bloqueFiltres();
        break;
      case 4:
        sourceList = this.supprimeFiltres();
        break;
      default:
        sourceList = this.allFiltres(); // ✅ Tous par défaut
        break;
    }
    // Pagination
    
    this.paginatedList = sourceList;
    //console.log("+++++ paginatedList affichée +++++", this.paginatedList);
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
      case 1: return 'user_all';
      case 2: return 'user_active';
      case 3: return 'user_block';
      case 4: return 'user_delete';
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

  toggleSelection(item: any) {
    if (item.checked) {
      if (!this.demande.objet_saisie.includes(item.label)) {
        this.demande.objet_saisie.push(item.label);
      }
    } else {
      this.demande.objet_saisie = this.demande.objet_saisie.filter(x => x !== item.label);
      // Si "Autres objets" est décoché, vider le champ texte
      if (item.id === 5) {
        this.demande.autreObjet = '';
      }
    }
   // console.log('Objets sélectionnés:', this.demande.objet_saisie);
   // console.log('Autre objet:', this.demande.autreObjet);
  }
toggleSelectionObjet(item: any) {
  // 🔒 Sécurisation : s'assurer que le tableau existe
  if (!this.demande.objet_retirer) {
    this.demande.objet_retirer = [];
  }

  if (item.checked) {
    // Ajout si non déjà présent
    if (!this.demande.objet_retirer.includes(item.label)) {
      this.demande.objet_retirer.push(item.label);
    }
  } 
  else {
    // Suppression si décoché
    this.demande.objet_retirer =
      this.demande.objet_retirer.filter(x => x !== item.label);

    // Si "Autres objets" est décoché (id === 5)
    if (item.id === 5) {
      this.demande.autreObjet = '';
    }
  }

  console.log('Objets sélectionnés:', this.demande.objet_retirer);
  console.log('Autre objet:', this.demande.autreObjet);
}
SaveSignature() {
  this.demande.statut = "En_attente";
  this.demande.user_id = this.currentUser.id;
  //console.log("========== objet_retirer", this.demande.objet_retirer);
 // console.log("========== rendez-vous", this.demande);
  this.loading = true;
  this.demande.nomComplet = this.demande.prenom + ' ' + this.demande.nom;

  this.demandeService.update(this.demande).subscribe({
    next: (ret) => {
      if (ret['code'] === 200) {
        this.demande = ret['data'];

        if (!Array.isArray(this.demandes)) {
          this.demandes = [];
        }
        this.demandes.push(this.demande);
       
        this.toast.success("Demande ajoutée avec succès");
        this.search();
        this.showList();
         this.closeAddElementDialog.nativeElement.click();
      } else {
        this.toast.error(ret['message']);
      }
      this.loading = false;
    },
    error: () => {
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
    }
  });
}

  Save() {
    if (!this.demande.scan_piece_verso) {
      this.toast.error('Veuillez selectionner la pièce justificatif du visiteur');
      return;
    }
    this.demande.statut = "En_attente";
    this.demande.objet_saisie
    this.demande.user_id = this.currentUser.id
    //console.log("========== objet_saisie ±±±±±±±±±±±±±±±±±±±±±±±", this.demande.objet_saisie)
   // console.log("========== rendez-vous ±±±±±±±±±±±±±±±±±±±±±±±", this.demande)
    // this.demande.user_personnel_id = null;
    //this.demande.visiteur_id = null;
    this.loading = true;
    this.demande.nomComplet = this.demande.prenom + ' ' + this.demande.nom;
    // 1. Remplacer le "+" par "00"
    const indicatif2Formate = this.indicatif2.value.replace("+", "00");
    const indicatifFormate = this.demande.indicatif.value.replace("+", "00");
    // 2. Concaténer
    const numeroSecondComplet = indicatif2Formate + this.demande.telephone_secondaire;
    const numeroComplet = indicatifFormate + this.demande.numeroTelephone;
    console.log(numeroComplet); // 002257075209345
    console.log(numeroSecondComplet); // 002257075209345

    this.demande.numeroTelephone = numeroComplet
    this.demande.telephone_secondaire = numeroSecondComplet

    this.demandeService.save(this.demande).subscribe(ret => {
      if (ret['code'] === 200) {
        this.demande = ret['data'];
        this.loading = false;
        this.demandes.push(this.demande);
        //this.closeAddElementDialog.nativeElement.click();
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
    this.demande.objet_retirer
    this.demande.user_id = this.currentUser.id
    console.log("========== objet_saisie ±±±±±±±±±±±±±±±±±±±±±±±", this.demande.objet_retirer)
    console.log("========== rendez-vous ±±±±±±±±±±±±±±±±±±±±±±±", this.demande)
      this.demandeService.update(this.demande).subscribe(ret => {
        if (ret['code'] === 200) {
          this.demande = ret['data'];
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
      this.demande.user_id = this.currentUser.id
      this.demandeService.delete(this.demande).subscribe((ret: any) => {
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
   // numberPhone = this.demande.indicatif + this.searchParam.query
    // 1. Remplacer le "+" par "00"
    const indicatifFormate = this.indicatif1.value.replace("+", "00");
    // 2. Concaténer
    numberPhone = indicatifFormate + this.searchParam.query;
    this.searchParam .query= numberPhone
    console.log(this.searchParam.query);
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



  /* ======================== Ulpoad Image ================================= */
  selectPicture() {
    // la methode de selection du media
    this.fileInput.nativeElement.click();
  }

  processWebImage(medias: any) {
    const file = medias.target.files[0];

    if (!file) return;

    const isPdf = file.type === 'application/pdf';

    if (!isPdf) {
      this.toast.error('Veuillez sélectionner uniquement un fichier PDF.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (readermedias) => {
      const pdfData = (readermedias.target as any).result;
      this.demande.scan_piece_verso = pdfData;
    };
    reader.readAsDataURL(file);
  }

  /* +++++++++++++++++++++++++ new code for signature++++++++++++++++++ */

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
    /*  this.demande.objet_saisie
     if (!this.demande.scan_piece_verso) {
       this.toast.error('Veuillez sélectionner la pièce justificative du visiteur.');
       return;
     } */
    this.step = 4;
  }
  formatPhone(numero: string): string {
    if (!numero) return '';
    // Exemple simple pour Mali
    if (numero.startsWith('+223')) {
      return numero.replace(/(\+223)(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }
    return numero;
  }



  filePDF!: File | null;
  pdfURL: any = null;

  onFileSelected(event: any) {
    this.filePDF = event.target.files[0];

    if (this.filePDF) {
      this.pdfURL = URL.createObjectURL(this.filePDF);
    }
  }

  previewPDF() {
    if (this.filePDF) {
      const url = URL.createObjectURL(this.filePDF);
      this.pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);

      const modal = new bootstrap.Modal(document.getElementById('pdfModal'));
      modal.show();
    }
  }

  previewURLPDF(url: string) {
    this.pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    const modal = new bootstrap.Modal(document.getElementById('pdfModal'));
    modal.show();
  }

  removePDF() {
    this.filePDF = null;
    this.pdfURL = null;
  }
}
