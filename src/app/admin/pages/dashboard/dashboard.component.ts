import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import SecureLS from 'secure-ls';
import { Utilisateur } from 'src/app/shared/models/utilisateur';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { AppConfig } from 'src/app/shared/utils/app-config';
import { AppToastService } from 'src/app/shared/utils/AppToast.service';
import { environment } from 'src/environments/environment';
Chart.register(...registerables);
export interface DashboardData {
    nbrTotalVisite: number;
   nbrVisiteEnCours: number;
   nbrVisiteTermine: number;
   nbrRendezVous: number;
   nbrIncidents: number;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public loading: boolean;
  public isDark: boolean;
  public isSearch: boolean;
  public currentUser: Utilisateur;
  public currentIndex: number = 1;
  public currentIndexDet: number = 1;
  public nbrTotalVisite: number = 0;
  public nbrVisiteEnCours: number = 0;
  public nbrVisiteTermine: number = 0;
  public nbrRendezVous: number = 0;
  public nbrIncidents: number = 0;
  public nbrUsers: number = 0;
  public detentionEnAlertes: any[] = [];
  public detentionHorsDelais: any[] = [];
  public alertActeDossiers: any[] = [];
  /* chart*/
  public detenuLabels = ["7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  public chartDataInfraction = {
    // labels: ["Siège", "Parquet", "Greffe", "Autres"],
    datasets: [
      {
        label: "Des visites par service",
        data: [11, 16, 7, 20],
        backgroundColor: ["#FF8F6B", "#244421ff", "#3340F4", "#8519F8"],
      },
    ]
  };
  @ViewChild('pchart') pchart: any;
  // data exemple — remplace par API
  lineLabels = ['7:00', '8:00', '10:00', '12:00', '13:00', '14:00', '15:00', '16:00', '18:00'];
  lineData = [1, 2, 5, 8, 22, 40, 30, 18, 42, 30, 18, 4];

  donutLegend = [
    { label: 'Siège', percent: 40, color: '#ff9800' },
    { label: 'Parquet', percent: 25, color: '#2196f3' },
    { label: 'Service courrier', percent: 20, color: '#244421ff' },
    { label: 'Autres services', percent: 15, color: '#9c27b0' }
  ];
  visiteurs = [
    { photo: 'assets/img/user1.jpg', nom: 'KONE Ibrahim', id: '12459', destination: 'Progô', service: 'Cartbis' },
    { photo: 'assets/img/user2.jpg', nom: 'SANDY Olivier', id: '56834', destination: 'Carouet', service: 'Parquet' },
    { photo: 'assets/img/user3.jpg', nom: 'OUEDRAOGO Ad.', id: '45050', destination: 'Groffe', service: 'Greffe' }
  ];
  rendezvous = [
    { visiteur: 'TRAORE Kadidja', motif: "Visite d'audience", date: '08/11/2026', status: 'A venir' },
    { visiteur: 'KOUAKOU Sekou', motif: 'Depot de documents', date: '08/11/2025 12:45', status: 'A venir' }
  ];
  dashData = [
    { label: 'Total des visites', value: this.nbrTotalVisite = 50, icon: 'mdi mdi-account-group', colorBg: 'bg-primary-soft' },
    { label: 'Visites en cours', value: this.nbrVisiteEnCours = 20, icon: 'mdi mdi-timer-sand', colorBg: 'bg-warning-soft' },
    { label: 'Visites terminées', value: this.nbrVisiteTermine = 34, icon: 'mdi mdi-check-circle-outline', colorBg: 'bg-success-soft' },
    { label: 'Total des rendez-vous', value: this.nbrRendezVous = 50, icon: 'mdi mdi-calendar', colorBg: 'bg-info-soft' },
    { label: 'Réclamations ouvertes', value: this.nbrIncidents = 2, icon: 'mdi mdi-alert-circle-outline', colorBg: 'bg-danger-soft' },
/*     { label: 'Utilisateurs', value: this.nbrUsers = 2, icon: 'mdi mdi-account', colorBg: 'bg-danger-soft' },
 */  ];
  totalVisites: number = 0;
  constructor(
    private dashboardService: DashboardService,
    private toast: AppToastService,
    private appConfig: AppConfig) {
    this.currentUser = this.appConfig.currentUser;
  }

  ngOnInit(): void {
    const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: 'MyAdminApp' });
    this.initDoughnut();
    this.initLineDetenus();
    this.ActualiseDash();
    this.calculerTotalVisites();
  }
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'validé': return 'pill valid';
      case 'en attente': return 'pill pending';
      case 'annulé': return 'pill cancelled';
      default: return 'pill';
    }
  }

  calculerTotalVisites() {
    this.totalVisites = this.donutLegend
      .map(x => x.percent)
      .reduce((a, b) => a + b, 0);
  }
  initDoughnut() {
    const ctx = document.getElementById("pieChartInfraction") as HTMLCanvasElement;
    this.pchart = new Chart(ctx, {
      type: "doughnut",
      data: this.chartDataInfraction,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: '',
            font: { size: 16 },
          },
          legend: {
            display: true,
            position: "bottom",
            align: 'start',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 15,
              font: {
                size: 14,
                family: 'Arial, sans-serif',
                weight: 'normal'
              },
              color: '#404040',
            }
          },
        }
      }
    });
  }
  initLineDetenus() {
    const ctx = (document.getElementById('chartLineDetenus') as HTMLCanvasElement).getContext('2d')!;

    // Create the gradient for the line
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0.1, '#0952c8ff');
    gradient1.addColorStop(0.6, '#064996ff');
    gradient1.addColorStop(1, '#0b7709ff');

    new Chart(ctx, {
      type: "line",
      data: {
        labels: this.detenuLabels,
        datasets: [{
          label: 'Visite du jours',
          data: this.lineData,
          fill: false,
          borderColor: gradient1,
          backgroundColor: '#FFFFFF',
          borderWidth: 3,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: '#fff',
          pointBorderColor: gradient1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Visite par Jour',
            font: { size: 16 }
          },
          legend: {
            display: false,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }
  onChangeCritere(criteriaLine: string) {
    switch (criteriaLine) {
      case '1':// par semaine
        this.detenuLabels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
        break;
      case '2':// par mois
        this.detenuLabels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
        break;
      case '3':// par années
        const years = [];
        const neDay = new Date();
        let currentAnnee = neDay.getUTCFullYear();
        for (let index = 11; index > 0; index--) {
          years.push(currentAnnee - index)
        }
        years.push(currentAnnee);
        this.detenuLabels = years;
        break;
    }
    this.initLineDetenus();
  }
  ActualiseDash() {
    this.dashboardService.findTotalDosEnCour().subscribe(ret => {
      if (ret['code'] === 200) {
        this.nbrTotalVisite = ret['nbrTotalVisite'];
        this.nbrVisiteEnCours = ret['nbrVisiteEnCours'];
        this.nbrVisiteTermine = ret['nbrVisiteTermine'];
        this.nbrRendezVous = ret['nbrRendezVous'];
        this.nbrIncidents = ret['nbrIncidents'];
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

  /*   this.dashboardService.findTotalOrdo().subscribe(ret => {
      if (ret['code'] === 200) {
        this.nbrOrdonnanceEncours = ret['data'];
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

    this.dashboardService.findDetentionAlert().subscribe(ret => {
      if (ret['code'] === 200) {
        this.detentionEnAlertes = ret['En_alert'];
        this.detentionHorsDelais = ret['Hors_delai'];
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

    this.dashboardService.findActeDossiers().subscribe(ret => {
      if (ret['code'] === 200) {
        this.alertActeDossiers = ret['Alert_acte_dossier'];
        this.nbrDossierAlert = ret['Alert_dossier'].length;
        this.nbrDossierHorsdelai = ret['Hors_delai'].length;
        this.loading = false;
      } else {
        this.loading = false;
        this.toast.error(ret['message']);
      }
    }, error => {
      console.log("error===>", error);
      this.toast.error(environment.erreur_connexion_message);
      this.loading = false;
    }); */
  }




  /* ±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±± */
  totalVics = 142;
  visitesEnCours = 12;
  visitesTerminees = 128;
  rendezvous1 = 56;
  incidents = 3;

  // Line chart
  lineChartData = [{
    data: [5, 8, 10, 15, 40, 28, 20, 35, 50],
    label: 'Visites',
    fill: true,
    tension: 0.4
  }];

  lineChartLabels = ['7:00', '8:00', '9:00', '11:00', '13:00', '15:00', '16:00', '18:00'];

  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  // PIE CHART DATA
  pieChartData = {
    labels: ['Siège', 'Parquet', 'Greffe', 'Autres'],
    datasets: [{
      data: [34, 47, 12, 7],
      backgroundColor: [
        '#3B82F6',
        '#6366F1',
        '#06B6D4',
        '#9CA3AF'
      ],
      borderWidth: 0
    }]
  };

  pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  visiteurs2 = [
    { photo: 'assets/images/profile/avatar.jpeg', nom: 'KONE',prenom:'Ibrahim', id: '12459', dest: 'Progô', service: 'Carlbis', heure: '9:20', status: 'En attente' },
    { photo: 'assets/images/profile/avatar.jpeg', nom: 'Traore.',prenom:'Karin', id: '45050', dest: 'Groffe', service: 'Greffe',heure: '11:20', status: 'En attente', },
    { photo: 'assets/images/profile/avatar.jpeg', nom: 'Thera',prenom:'Allassane', id: '45050', dest: 'Groffe', service: 'Greffe',heure: '10:20', status: 'En attente', },
  ];

  prochains = [
    { photo: 'assets/images/profile/avatar.jpeg', id_rendez_vous: "RDV001", nom: 'TRAORE Kadidja', forme: 'Visite d’audience', date: '08/11/2026', heure: '-',service_agent: "Service IT / Alice Martin", status: 'En attente' },
    { photo: 'assets/images/profile/avatar.jpeg', id_rendez_vous: "RDV002", nom: 'KOUAKOU Sekou', forme: 'Dépôt de documents', date: '08/11/2025', heure: '12:45',service_agent: "Service IT / Alice Martin", status: 'En attente' },
    { photo: 'assets/images/profile/avatar.jpeg', id_rendez_vous: "RDV003", nom: 'KOUAKOU Moussa', forme: 'Dépôt de documents', date: '08/11/2025', heure: '12:45',service_agent: "Service IT / Alice Martin", status: 'En attente' },
  ];

  /* ±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±± */
}
