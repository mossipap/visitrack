import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Utilisateur } from 'src/app/shared/models/utilisateur';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { AppConfig } from 'src/app/shared/utils/app-config';
import { AppToastService } from 'src/app/shared/utils/AppToast.service';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import * as SecureLS from 'secure-ls';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('miniChart1') miniChart1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('miniChart2') miniChart2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('miniChart3') miniChart3!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bigChart') bigChart!: ElementRef<HTMLCanvasElement>;

  private c1?: Chart; private c2?: Chart; private c3?: Chart; private big?: Chart;

  ngAfterViewInit(): void {
    // small demo data
    this.c1 = this.makeMini(this.miniChart1.nativeElement, '#0664FC', [12,20,15,28,18,22,30]);
    this.c2 = this.makeMini(this.miniChart2.nativeElement, '#2D9CDB', [8,10,22,12,18,25,20]);
    this.c3 = this.makeMini(this.miniChart3.nativeElement, '#7B61FF', [5,15,14,18,14,20,25]);
    this.big = this.makeBar(this.bigChart.nativeElement);
  }

  private makeMini(canvas: HTMLCanvasElement, color: string, data: number[]) {
    const ctx = canvas.getContext('2d'); if(!ctx) return;
    const g = ctx.createLinearGradient(0,0,0,100); g.addColorStop(0, this.hexToRgba(color,0.25)); g.addColorStop(1, this.hexToRgba(color,0));
    return new Chart(ctx, {
      type: 'line',
      data: { labels: ['L','M','M','J','V','S','D'], datasets: [{ data, borderColor: color, backgroundColor: g, fill:true, tension:0.35, pointRadius:0 }] },
      options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{x:{display:false}, y:{display:false}} }
    });
  }

  private makeBar(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d'); if(!ctx) return;
    return new Chart(ctx, {
      type: 'bar',
      data: { labels: ['Accueil','Parquet','USPG','Siège','Service A','Service B'], datasets:[{ data:[120,90,60,42,30,18], backgroundColor:['#0664FC','#2D9CDB','#7B61FF','#FF7A5A','#F2C94C','#10B981'], borderRadius:8 }] },
      options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{x:{grid:{display:false}}, y:{beginAtZero:true}} }
    });
  }

  private hexToRgba(hex: string, a: number){ const h = hex.replace('#',''); const n = parseInt(h,16); return `rgba(${(n>>16)&255}, ${(n>>8)&255}, ${n&255}, ${a})`;}

  ngOnDestroy(): void { this.c1?.destroy(); this.c2?.destroy(); this.c3?.destroy(); this.big?.destroy(); }











 public currentUser: Utilisateur;
  public loading: boolean;
  public isDark: boolean;
  public nbrDossierRecu: any = 45412;
  public nbrPlainteSave: any = 5;
  public nbrRequisitionIntro: any = 551;
  public lineLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    public barLabels = ['Accueil','Parquet','USPG','Siège','Service A','Service B'];


  public expandedRows = {};

  constructor(
    private dashboardService: DashboardService,
    private toast: AppToastService,
    private appConfig: AppConfig) {
    this.currentUser = this.appConfig.currentUser;
  }
 setPeriod(period: 'day' | 'month' | 'year') {
   // this.selectedPeriod = period;
    //this.updateDisplayedData();
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
      this.changeTrHover('#1c1c1c');
      this.changePrimeTbHead('#000000');
      this.changePaginatorLight('#252116');
      this.changeScrollView('#1c1d1d');
      this.changeScrollBorder('#1c1d1d');
      this.changeSearchbar('#1c1d1d');
      this.changeBgTheader('rgba(10, 141, 208, 0.2)');
    } else {//white
      this.isDark = false;
      const headerLeft = document.getElementsByClassName("theme-dark");
      for(var i = headerLeft.length - 1; i >= 0; --i) {
        headerLeft[i].classList.replace('theme-dark', 'theme-light');
      }
      this.changePaginationBg('#ffffff');
      this.changePaginationFg('#000000');
      this.changePrimeTbBg('#ffffff');
      this.changeTrHover('rgba(0, 0, 0, 0.3)');
      this.changePrimeTbHead('#f8f9fa');
      this.changePaginatorLight('#ecf5ee');
      this.changeScrollView('#FFFFFF');
      this.changeScrollBorder('#EBEBEB');
      this.changeSearchbar('#F5F5F5');
      this.changeBgTheader('rgba(10, 141, 208, 0.2)');
    }
    this.initLine1();
    this.initLine2();
    this.initLine3();
    this.initLine4();
    this.initLine5();
    this.initLine6();
    this.initLine7();
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
  changeScrollView(newValue: string): void {
    document.documentElement.style.setProperty('--scroll_view', newValue);
  }
  changeScrollBorder(newValue: string): void {
    document.documentElement.style.setProperty('--scroll_border', newValue);
  }
  changeSearchbar(newValue: string): void {
    document.documentElement.style.setProperty('--search_bar', newValue);
  }
  changeBgTheader(newValue: string): void {
    document.documentElement.style.setProperty('--theaderbg', newValue);
  }
  onRowExpand(event: TableRowExpandEvent) {}
  onRowCollapse(event: TableRowCollapseEvent) {}
initLine1() {
  const canvas = document.getElementById('chartDossierRecu') as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
 gradient1.addColorStop(0.1, ' #0664FC');  // Start color
    gradient1.addColorStop(1, ' #DEE3FF');  // Mid color #8ea2f9
    gradient1.addColorStop(0.6, ' #FD5DEF');  // 

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: this.lineLabels,
      datasets: [{
        label: 'Nombre de Visites',
        data: [65, 55, 80, 67, 48, 55, 43],
        fill: true,
        borderColor: '#0664FC',
        backgroundColor: 'rgba(222, 227, 255, 0.5)',
        borderWidth: 2,
        tension: 0.5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          position: 'top'
        },
        title: {
          display: true,
          text: ''
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#666'
          },
          grid: {
            color: '#e0e0e0'
          }
        },
        y: {
          beginAtZero: true, // ✅ ici (pas dans ticks)
          ticks: {
            color: '#666'
          },
          grid: {
            color: '#e0e0e0'
          }
        }
      }
    }
  });
}


initLine2() {
  const ctx = (document.getElementById('chartPlainteSave') as HTMLCanvasElement).getContext('2d');
  const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
  gradient1.addColorStop(0.1, '#0664FC');  // Start color
  gradient1.addColorStop(0.6, '#FD5DEF');  // Mid color
  gradient1.addColorStop(1, '#DEE3FF');    // End color

  new Chart(ctx, {
    type: "line",
    data: {
      labels: this.lineLabels,
      datasets: [{
        label: 'Rendez-vous en attente',
        data: [65, 55, 80, 67, 48, 55, 43],
        fill: true,
        borderColor: gradient1,
        backgroundColor: 'rgba(222, 227, 255, 0.5)',
        borderWidth: 2,
        tension: 0.5,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          display: false,
        },
        title: {
          display: true,
        }
      },
      scales: {
        y: {        // <-- remplacer yAxes par y
          beginAtZero: true
        },
        x: {        // <-- si besoin d'options pour x
          ticks: {
            // vos options ici
          }
        }
      }
    }
  });
}

  initLine3() {
    const ctx = (document.getElementById('chartRequiIntro') as HTMLCanvasElement).getContext('2d');
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0.1, ' #0664FC');  // Start color
    gradient1.addColorStop(1, ' #DEE3FF');  // Mid color #8ea2f9
    gradient1.addColorStop(0.6, ' #FD5DEF');  // End color
    new Chart(ctx, {
      type: "line",
      data: {
        labels: this.lineLabels,
        datasets: [{
          label: 'Rendez-vous Terminées',
          data: [65, 55, 80, 67, 48, 55, 43],
          fill: true,
          borderColor: gradient1,
          backgroundColor: ' rgba(222, 227, 255, 0.5)',
          borderWidth: 2,
          tension: 0.5,
        }]
      },
       options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          display: false,
        },
        title: {
          display: true,
        }
      },
      scales: {
        y: {        // <-- remplacer yAxes par y
          beginAtZero: true
        },
        x: {        // <-- si besoin d'options pour x
          ticks: {
            // vos options ici
          }
        }
      }
    }
    });
  }
  initLine4() {
    const ctx = (document.getElementById('chartDosTransmis') as HTMLCanvasElement).getContext('2d');
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0.1, ' #0664FC');  // Start color
    gradient1.addColorStop(1, ' #DEE3FF');  // Mid color
    gradient1.addColorStop(0.6, ' #FD5DEF');  // End color
    new Chart(ctx, {
      type: "line",
      data: {
        labels: this.lineLabels,
        datasets: [{
          label: 'Rendez-vous planifiés',
          data: [65, 55, 80, 67, 48, 55, 43],
          fill: true,
          borderColor: gradient1,
          backgroundColor: ' rgba(222, 227, 255, 0.5)',
          borderWidth: 2,
          tension: 0.5,
        }]
      },
      options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          display: false,
        },
        title: {
          display: true,
        }
      },
      scales: {
        y: {        // <-- remplacer yAxes par y
          beginAtZero: true
        },
        x: {        // <-- si besoin d'options pour x
          ticks: {
            // vos options ici
          }
        }
      }
    }
    });
  }
  initLine5() {
    const ctx = (document.getElementById('chartSansSuite') as HTMLCanvasElement).getContext('2d');
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0.1, ' #0664FC');  // Start color
    gradient1.addColorStop(1, ' #DEE3FF');  // Mid color #8ea2f9
    gradient1.addColorStop(0.6, ' #FD5DEF');  // End color
    new Chart(ctx, {
      type: "line",
      data: {
        labels: this.lineLabels,
        datasets: [{
          label: 'Rendez-vous récu',
          data: [65, 55, 80, 67, 48, 55, 43],
          fill: true,
          borderColor: gradient1,
          backgroundColor: ' rgba(222, 227, 255, 0.5)',
          borderWidth: 2,
          tension: 0.5,
        }]
      },
     options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          display: false,
        },
        title: {
          display: true,
        }
      },
      scales: {
        y: {        // <-- remplacer yAxes par y
          beginAtZero: true
        },
        x: {        // <-- si besoin d'options pour x
          ticks: {
            // vos options ici
          }
        }
      }
    }
    });
  }
  initLine6() {
    const ctx = (document.getElementById('chartAtteTraite') as HTMLCanvasElement).getContext('2d');
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0.1, ' #0664FC');  // Start color
    gradient1.addColorStop(1, ' #DEE3FF');  // Mid color #8ea2f9
    gradient1.addColorStop(0.6, ' #FD5DEF');  // End color
    new Chart(ctx, {
      type: "line",
      data: {
        labels: this.lineLabels,
        datasets: [{
          label: 'Nombre de visites',
          data: [65, 55, 80, 67, 48, 55, 43],
          fill: true,
          borderColor: gradient1,
          backgroundColor: ' rgba(222, 227, 255, 0.5)',
          borderWidth: 2,
          tension: 0.5,
        }]
      },
     options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          display: false,
        },
        title: {
          display: true,
        }
      },
      scales: {
        y: {        // <-- remplacer yAxes par y
          beginAtZero: true
        },
        x: {        // <-- si besoin d'options pour x
          ticks: {
            // vos options ici
          }
        }
      }
    }
    });
  }
  initLine7() {
    const ctx = (document.getElementById('chartDossierRenvoie') as HTMLCanvasElement).getContext('2d');
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0.1, ' #0664FC');  // Start color
    gradient1.addColorStop(1, ' #0664FC');  // Mid color #8ea2f9
    gradient1.addColorStop(0.6, ' #0664FC');  // End color
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: this.barLabels,
        datasets: [{
          label: 'Nombre de visites',
          data: [120,90,60,42,30,18],
         // fill: true,
          borderColor: ['#0664FC','#2D9CDB','#7B61FF','#FF7A5A','#F2C94C','#10B981'],
          backgroundColor: ['#0664FC','#2D9CDB','#7B61FF','#FF7A5A','#F2C94C','#10B981'], borderRadius:8 ,
          borderWidth: 2,
         // tension: 0.5,
        }]
      },
        options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          display: false,
        },
        title: {
          display: true,
        }
      },
      scales: {
        y: {        // <-- remplacer yAxes par y
          beginAtZero: true
        },
        x: {        // <-- si besoin d'options pour x
          ticks: {
            // vos options ici
          }
        }
      }
    }
    });
  }
}
