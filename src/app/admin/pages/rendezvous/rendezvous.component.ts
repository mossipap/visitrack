import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AppToastService } from 'src/app/shared/utils/AppToast.service';
import { environment } from 'src/environments/environment';
import { AppConfig } from 'src/app/shared/utils/app-config';
import * as SecureLS from 'secure-ls';
import { Cabinet } from 'src/app/shared/models/cabinet';
import { Profil } from 'src/app/shared/models/profil';
import { TypeUser} from 'src/app/shared/models/type-user';
import { CabinetService } from 'src/app/shared/services/cabinet.service';
import { RoleManager } from 'src/app/shared/utils/role-manager';
import { SearchParam } from 'src/app/shared/utils/search-param';
import { Demande } from 'src/app/shared/models/demande';
import { DemandeService } from 'src/app/shared/services/demande.service';
import { TypeUserService } from 'src/app/shared/services/typeuser.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-rendezvous',
  templateUrl: './rendezvous.component.html',
  styleUrls: ['./rendezvous.component.css']
})
export class RendezvousComponent implements OnInit {
 public demandes: Demande[] = [];
  public activeList: any[] = [];
  public bloqueList: Demande[] = [];
  public suppriList: Demande[] = [];
  public selectedUsers: Demande[] [];
  public demande: Demande = new Demande();
  public visiteur: Demande = new Demande();
  public cabinets: Cabinet[] = [];
  public cabinetFilter = { designation: '' };
  public typeUsers: TypeUser[] = [];
  public typeUserFilter = { designation: '' };
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
  
  constructor(
    private demandeService: DemandeService,
    private cabinetService: CabinetService,
    private typeUserService: TypeUserService,
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
    if (ls.get('current_theme')) {//dark
      this.isDark = true;
      const headerLeft = document.getElementsByClassName("theme-light");
      for(var i = headerLeft.length - 1; i >= 0; --i) {
        headerLeft[i].classList.replace('theme-light', 'theme-dark');
      }
      this.changeRowPad('rgb(21 21 21 / 100%)');
      this.changeStepLabel('#FFFFFF');
      this.changeBgsearchbar('rgb(28, 28, 28)');
      this.changePaginationBg('#000000');
      this.changePaginationFg('#ffffff');
      this.changePrimeTbBg('#000000');
      this.changeTrHover('#1c1c1c');
      this.changePrimeTbHead('#000000');
      this.changePaginatorLight('#252116');
      this.changeBtnDivBg('#252117');
    } else {//white
      this.isDark = false;
      const headerLeft = document.getElementsByClassName("theme-dark");
      for(var i = headerLeft.length - 1; i >= 0; --i) {
        headerLeft[i].classList.replace('theme-dark', 'theme-light');
      }
      this.changeRowPad('rgb(255 255 255 / 100%)');
      this.changeStepLabel('#7f56d9');
      this.changeBgsearchbar('rgba(255, 255, 255, 0.8)');
      this.changePaginationBg('#ffffff');
      this.changePaginationFg('#000000');
      this.changePrimeTbBg('none');
      this.changeTrHover('rgba(0, 0, 0, 0.3)');
      this.changePrimeTbHead('#f8f9fa');
      this.changePaginatorLight('#ecf5ee');
      this.changeBtnDivBg('#faf4f3');
      this.changeBgTheader('rgba(255, 199, 154, 0.5)');
    }
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
  activeFiltres () {
    if (!this.searchFilterText) return this.activeList
    const search = this.searchFilterText.toLowerCase()
    return this.activeList.filter(item => {
      const text = (item.nomComplet + ' ' + item.nomComplet + ' ' + item.numeroTelephone+ ' '+ item.cabinet?.numerocabinet).toLowerCase();
      return text.indexOf(search) > -1
    })
  }
  bloqueFiltres () {
    if (!this.searchFilterText) return this.bloqueList
    const search = this.searchFilterText.toLowerCase()
    return this.bloqueList.filter(item => {
      const text = (item.nomComplet + ' ' + item.nomComplet + ' ' + item.numeroTelephone).toLowerCase();
      return text.indexOf(search) > -1
    })
  }
  supprimeFiltres () {
    if (!this.searchFilterText) return this.suppriList
    const search = this.searchFilterText.toLowerCase()
    return this.suppriList.filter(item => {
      const text = (item.nomComplet + ' ' + item.nomComplet + ' ' + item.numeroTelephone).toLowerCase();
      return text.indexOf(search) > -1
    })
  }

  onChangeCode(index) {
    if(index === 1) {//active
      let btnUserActive = document.getElementById("user_active");
      let btnUserBlock = document.getElementById("user_block");
      let btnUserDelete = document.getElementById("user_delete");

      btnUserActive.classList.add("btn_active");
      btnUserActive.classList.remove("btn_not_active");
      btnUserBlock.classList.add("btn_not_active");
      btnUserBlock.classList.remove("btn_active");
      btnUserDelete.classList.add("btn_not_active");
      btnUserDelete.classList.remove("btn_active");
      this.currentIndex = index;
    } else if(index === 2) {//block
      let btnUserBlock = document.getElementById("user_block");
      let btnUserActive = document.getElementById("user_active");
      let btnUserDelete = document.getElementById("user_delete");

      btnUserBlock.classList.add("btn_active");
      btnUserBlock.classList.remove("btn_not_active");
      btnUserActive.classList.add("btn_not_active");
      btnUserActive.classList.remove("btn_active");
      btnUserDelete.classList.add("btn_not_active");
      btnUserDelete.classList.remove("btn_active");
      this.currentIndex = index;
    } else {//delete
      let btnUserDelete = document.getElementById("user_delete");
      let btnUserActive = document.getElementById("user_active");
      let btnUserBlock = document.getElementById("user_block");

      btnUserDelete.classList.add("btn_active");
      btnUserDelete.classList.remove("btn_not_active");
      btnUserBlock.classList.add("btn_not_active");
      btnUserBlock.classList.remove("btn_active");
      btnUserActive.classList.add("btn_not_active");
      btnUserActive.classList.remove("btn_active");
      this.currentIndex = index;
    }
  }

  showList() {
    this.currentView = 'list';
    this.pageTitle = 'Liste'
  }
  showAddForm() {
    this.demande = new Demande();
    this.findCabinets();
    this.findTypeUsers();
    this.currentView = 'add';
    this.pageTitle = 'Nouveau demande';
    this.searchParam.query = ""
  }

  showEditForm(user: Demande) {
    this.demande = user;
    this.findCabinets();
    this.findTypeUsers();
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

  showDeleteDialog(demande: Demande): void {
    this.demande = demande;
    this.deleteConfirmDialog.nativeElement.click();
  }

search() {
  this.loading = true;
  this.demandeService.findAll().subscribe(
    (ret) => {
      if (ret['code'] == 200) {

        // ✅ Récupération correcte de la liste
        this.demandes = ret['data']['data'];

        const actiList = [];
        const blocList = [];
        const deleList = [];

        this.demandes.forEach(dem => {
          switch (dem.statut) {
            case 'En cours':
              actiList.push(dem);
              break;
            case 'Bloqué':
              blocList.push(dem);
              break;
            case 'Supprimé':
              deleList.push(dem);
              break;
          }
        });

        this.activeList = actiList;
        this.bloqueList = blocList;
        this.suppriList = deleList;

        this.totalPages = Math.ceil(this.activeList.length / this.itemsPerPage);
        this.updatePaginatedList();

        this.toast.info(`${this.demandes.length} demande(s) trouvée(s)`);

      } else {
        this.toast.error(ret['message']);
      }

      this.loading = false;
    },
    () => {
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
    }
  );
}

updatePaginatedList() {
  let sourceList = [];

  if (this.currentIndex === 1) {
    sourceList = this.activeList;
  } else if (this.currentIndex === 2) {
    sourceList = this.bloqueList;
  } else {
    sourceList = this.suppriList;
  }
  // recalcul du total des pages ici
  this.totalPages = Math.ceil(sourceList.length / this.itemsPerPage);
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  this.paginatedList = sourceList.slice(startIndex, startIndex + this.itemsPerPage);
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
    this.demande.typeUser_id = this.demande.typeUser.id;
    this.demande.profil_id = this.demande.profil.id; */
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

UpdateStatut(statut: string) {
  this.loading = true;
  this.demande.statut = statut;

  this.demandeService.updateStatut(this.demande).subscribe(
    ret => {
      if (ret['code'] === 200) {
        this.demande = ret['data'];

        // MAJ dans la liste locale
        this.demandes.forEach(user => {
          if (user.id === this.demande.id) {
            user.statut = this.demande.statut;
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


  checkCabinetUser(cabinetId: number, typeUserId: number) {
    if(typeUserId !== 3) {
      return;
    }
    if (!cabinetId) {
      this.toast.error("Veuillez selectionner un cabinet, SVP ..");
      this.demande.typeUser = null;
      return
    }
    const objetCheck = {
      cabinet_id: cabinetId,
      typeUser_id: typeUserId
    }
    this.demandeService.verifyJugeOfCabinet(objetCheck).subscribe(ret => {
      if (ret['code'] === 200) {
      } else {
        this.toast.error(ret['message']);
        this.loading = false;
        this.demande.cabinet = null;
        this.demande.typeUser = null;
      }
    }, error => {
      console.log("error===", error);
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
    });
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

  findTypeUsers() {
    this.typeUserService.findAll().subscribe(ret => {
      if (ret['code'] === 200) {
        this.typeUsers = ret['data'];
        if (this.currentView === 'edit' || this.currentView === 'detail' && this.demande.user_agent_id && this.typeUsers.length > 0) {
          this.demande.typeUser = this.typeUsers.find(p => p.id === this.demande.user_agent_id)
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
  
    searchVisiteurByNumber3(){
    this.demandeService.findByNumero(this.searchParam).subscribe(ret => {
      if (ret['code'] === 200 && (ret['data']==null))   {
        this.demande = ret['data'];
        this.currentView === 'add';
        this.loading = false;
      } else if(ret['code'] === 200)  {
        this.demande = ret['data'];
        this.currentView = 'add';
        this.loading = false;
      }
      else {
        this.toast.error(ret['message']);
        this.loading = false;
      }
    }, error => {
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
    });
  }
    searchVisiteurByNumber(numberPhone: string) {
       console.log("query===>", numberPhone);
    this.loading = true;
    this.demandeService.findByNumero(this.searchParam).subscribe(ret => {
      if (ret['code'] === 200) {
        this.demande = ret['data'];
        this.toast.success("Visiteur Trouvé avec succès");
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
