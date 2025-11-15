import { Component, OnInit} from '@angular/core';
import { SearchParam } from 'src/app/shared/utils/search-param';
@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.css']
})
export class RapportComponent implements OnInit {
  public loading: boolean;
  public searchParam: SearchParam;

  filtre = { dateRange: null, service: null, typePiece: null };
  services = [
    { designation: 'Accueil' },
    { designation: 'Direction' },
    { designation: 'Comptabilité' },
    { designation: 'RH' }
  ];


  rapportData: any[] = [];
  resumeServices: any[] = [];
  selectedVisitor: any = null;
  showDetails = false;
 
constructor() {
  this.searchParam = new SearchParam();
}

  ngOnInit() {
     this.searchParam.dateFin.setDate(this.searchParam.dateFin.getDate() + 1);
    this.genererDonnees();
 

  }

  genererDonnees() {
    this.rapportData = [
      {
        nomComplet: 'Diakaria Coulibaly',
        service: 'Direction',
        dateVisite: new Date(),
        heureArrive: '08:30',
        heureDepart: '09:10',
        typePiece: 'CNI',
        numeroPiece: 'MAL12345',
        statut: 'Terminé',
        sexe: 'Homme',
        photo: 'assets/images/profile/avatar.jpeg',
        signature: 'assets/images/signature.png',
        historique: [
          { date: new Date('2025-09-10'), service: 'Comptabilité' },
          { date: new Date('2025-09-20'), service: 'Direction' }
        ]
      },
      {
        nomComplet: 'Aïssata Koné',
        service: 'Accueil',
        dateVisite: new Date(),
        heureArrive: '10:00',
        heureDepart: '10:35',
        typePiece: 'Passeport',
        numeroPiece: 'MLP3322',
        statut: 'En attente',
        sexe: 'Femme',
        historique: [{ date: new Date('2025-09-18'), service: 'RH' }]
      }
    ];

    this.resumeServices = [
      { service: 'Direction', total: 5, dureeMoyenne: 35, hommes: 3, femmes: 2 },
      { service: 'Accueil', total: 8, dureeMoyenne: 25, hommes: 5, femmes: 3 }
    ];
  }

  calculerDuree(arrive: string, depart: string): number {
    const [h1, m1] = arrive.split(':').map(Number);
    const [h2, m2] = depart.split(':').map(Number);
    return (h2 * 60 + m2) - (h1 * 60 + m1);
  }

  ouvrirDetails(visitor: any) {
    this.selectedVisitor = visitor;
    this.showDetails = true;
  }

  filtrerRapport() {
    console.log('Filtres appliqués :', this.filtre);
  }

  exportToExcel() {
    console.log('Export en Excel…');
  }
}
