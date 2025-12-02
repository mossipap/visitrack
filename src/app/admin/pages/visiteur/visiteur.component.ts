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
import { DomSanitizer } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { Editor } from 'ngx-editor';
import { Indicatifs, Nationalites } from 'src/app/shared/models/nationalite';
declare var bootstrap: any;
@Component({
  selector: 'app-visiteur',
  templateUrl: './visiteur.component.html',
  styleUrls: ['./visiteur.component.css']
})
export class VisiteurComponent implements OnInit {
  public visiteurs: Visiteur[] = [];
  public selectedUsers: Demande[][];
 public visiteur: Visiteur = new Visiteur();
   public demande: Demande = new Demande();

  public demandes: Demande[] = [];
  public cabinets: Cabinet[] = [];
  public cabinetFilter = { designation: '' };
  public services: Service[] = [];
  public typeUserFilter = { designation: '' };
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
 // public currentPage = 1;
  public searchFilterText: string = '';
  public dialogAction: string;
  public confirmPassword: string;
  public currentIndex: any = 1;
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
  searchValue: any;
  filteredVisiteurs: any[] = []; // la portion affichée
  selectAll: boolean = false;
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
    private visiteurService: DemandeService,
    private cabinetService: CabinetService,
    private typeUserService: ServiceService,
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
    this.loadIndicatifs();
   this.editor = new Editor();
    this.editor1 = new Editor();
    this.search();
    this.loadIndicatifs();

  }


  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
    this.editor1.destroy();
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
    this.search();
  }
  showAddForm() {
    this.visiteur = new Visiteur();
    this.findCabinets();
    this.findServices();
    this.currentView = 'add';
    this.pageTitle = 'Nouveau visiteur';
    this.demande.indicatif = this.indicatifsNums.find(i => i.value === '+225')  // ← valeur par défaut
    this.indicatif1= this.indicatifsNums.find(i => i.value === '+225')  // ← valeur par défaut
    this.indicatif2 = this.indicatifsNums.find(i => i.value === '+225')  // ← valeur par défaut
  }

  showEditForm(v: Visiteur) {
    this.visiteur = v;
    this.visiteur.dateVisite = new Date(v.dateVisite);
    this.visiteur.dateExepiration = new Date(v.dateExepiration);
    this.visiteur.dateDelivrance = new Date(v.dateDelivrance);
    this.demande.indicatif = this.indicatifsNums.find(i => i.value === '+225')  // ← valeur par défaut
    this.indicatif1= this.indicatifsNums.find(i => i.value === '+225')  // ← valeur par défaut
    this.indicatif2 = this.indicatifsNums.find(i => i.value === '+225')  // ← valeur par défaut
    this.findCabinets();
    this.findServices();
    this.currentView = 'edit';
    this.pageTitle = 'Modification d\'visiteur';
  }

 showDetail(v: Visiteur) {
  this.visiteur = v;
  // PDF en dur
  const filePath = "assets/images/piece.pdf";
  // Sécurisation Angular obligatoire
  this.visiteur.pieceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(filePath);
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

  showResetDialog(visiteur: Visiteur): void {
    this.visiteur = visiteur;
  }

  showConfirmDialog(visiteur: Visiteur): void {
    // this.dialogAction = action;
    this.visiteur = visiteur;
    this.openConfirmDialog.nativeElement.click();
  }
  showDeleteDialog(visiteur: Visiteur): void {
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
      this.visiteurService.deleteVisiteur(this.visiteur).subscribe((ret: any) => {
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
}
  // 🔹 Charger tous les visiteurs
search() {
  this.loading = true;
  this.visiteurService.findAllVisiteur().subscribe({
    next: (ret) => {
      this.loading = false;
      if (ret['code'] === 200 && ret['data'] && Array.isArray(ret['data'].data)) {
        const visiteursList = ret['data']['data'];
        // ✅ Transformation du numéro 00225 → +225
        this.visiteurs = visiteursList.map((p: any) => ({
          ...p,
          selected: false,
          numeroTelephone: p.numeroTelephone
            ? p.numeroTelephone.replace(/^00/, '+')
            : null
        }));
         //console.log("+++++ ret['data'] +++++", ret['data']);
       
        // Copie filtrée
        this.filteredVisiteurs = [...this.visiteurs];

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
 onPageChange(page: number) {
    this.page = page;
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

    this.visiteurService.save(this.demande).subscribe(ret => {
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
    /* this.visiteur.cabinet_id = this.visiteur.cabinet.id;
    this.visiteur.typeUser_id = this.visiteur.typeUser.id;*/
    this.visiteur.user_id = this.currentUser.id; 
    this.visiteurService.updateVisiteur(this.visiteur).subscribe(ret => {
      if (ret['code'] === 200) {
        this.visiteur = ret['data'];
        //this.closeAddElementDialog.nativeElement.click();
        this.toast.success("Visiteur modifié avec succès");
        this.loading = false;
        this.showList();

      } else {
        this.toast.error(ret['message']);
        this.loading = false;
      }
    }, error => {
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
    });
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

  console.log('Objets sélectionnés:', this.demande.objet_saisie);
  console.log('Autre objet:', this.demande.autreObjet);
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
  searchVisiteurByNumber(numberPhone: string) {
   // numberPhone = this.demande.indicatif + this.searchParam.query
    // 1. Remplacer le "+" par "00"
    const indicatifFormate = this.indicatif1.value.replace("+", "00");
    // 2. Concaténer
    numberPhone = indicatifFormate + this.searchParam.query;
    this.searchParam .query= numberPhone
    console.log(this.searchParam.query);
    this.loading = true;
    this.visiteurService.findByNumero(this.searchParam).subscribe({
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
  this.demande.statut = "Terminé";
  this.demande.user_id = this.currentUser.id;
  this.loading = true;
  this.demande.nomComplet = this.demande.prenom + ' ' + this.demande.nom;
  this.visiteurService.update(this.demande).subscribe({
    next: (ret) => {
      if (ret['code'] === 200) {
        this.demande = ret['data'];

        if (!Array.isArray(this.demandes)) {
          this.demandes = [];
        }
        this.demandes.push(this.demande);
       
        this.toast.success("Demande ajoutée avec succès");
      //   this.closeAddElementDialog.nativeElement.click();
           this.search();
        this.showList();
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
  showSignature(dem: Demande) {
    this.demande = dem;
    this.findCabinets();
    this.findServices();
    this.currentView = 'signature';
  }


}
