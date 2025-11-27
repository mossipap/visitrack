import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { StuPoint, StuWebsocketService } from 'src/app/shared/services/stu-websocket.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css'],

})
export class SignatureComponent implements OnInit {
 @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private width = 600;
  private height = 200;

  private subs: Subscription[] = [];
  signatureBase64: string | null = null;
  isRecording = false;

  // buffer des strokes (pour export vectoriel si besoin)
  private strokes: StuPoint[][] = [];
  private currentStroke: StuPoint[] = [];
  constructor(private stu: StuWebsocketService, private http: HttpClient) {}

  ngOnInit() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = this.width;
    canvas.height = this.height;
    this.ctx = canvas.getContext('2d')!;
    this.clearCanvas();
console.log("+++++++++++++++ stu ++++++++++++",this.stu)
    this.subs.push(this.stu.points$.subscribe(p => this.onPoint(p)));
    this.subs.push(this.stu.image$.subscribe(b64 => this.onImage(b64)));
    this.subs.push(this.stu.status$.subscribe(s => console.log('status', s)));
    this.subs.push(this.stu.errors$.subscribe(e => console.error('ws error', e)));
    
  }
  start() {
    this.clearCanvas();
    this.strokes = [];
    this.currentStroke = [];
    this.isRecording = true;
    this.stu.requestStart();
  }

  stop() {
    this.isRecording = false;
    this.stu.requestStop();
    // request the daemon to send the image (if daemon supports)
    // otherwise we generate image from canvas
    setTimeout(() => {
      this.signatureBase64 = this.canvasRef.nativeElement.toDataURL('image/png').split(',')[1];
    }, 200);
  }

  clear() {
    this.stu.requestClear();
    this.clearCanvas();
    this.signatureBase64 = null;
    this.strokes = [];
    this.currentStroke = [];
  }

  private onPoint(p: StuPoint) {
    // dessiner le point sur le canvas
    if (!this.ctx) return;
    const radius = Math.max(1, (p.pressure ?? 0.5) * 3);
    if (!this.currentStroke.length) {
      this.currentStroke.push(p);
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.strokeStyle = '#111';
      this.ctx.lineWidth = radius * 2;
    } else {
      const prev = this.currentStroke[this.currentStroke.length - 1];
      this.ctx.lineWidth = radius * 2;
      this.ctx.lineTo(p.x, p.y);
      this.ctx.stroke();
      this.currentStroke.push(p);
    }
  }

  private onImage(b64: string) {
    // image envoyée par le daemon
    this.signatureBase64 = b64;
    // optionnel : afficher l'image dans le canvas
    const img = new Image();
    img.onload = () => {
      this.clearCanvas();
      this.ctx.drawImage(img, 0, 0, this.width, this.height);
    };
    img.src = 'data:image/png;base64,' + b64;
  }

  download() {
    if (!this.signatureBase64) {
      // fallback: generate from canvas
      this.signatureBase64 = this.canvasRef.nativeElement.toDataURL('image/png').split(',')[1];
    }
    const link = document.createElement('a');
    link.href = 'data:image/png;base64,' + this.signatureBase64;
    link.download = 'signature.png';
    link.click();
  }

  sendToBackend() {
    if (!this.signatureBase64) return alert('Aucune signature à envoyer');
    const payload = { base64: this.signatureBase64, meta: { createdAt: new Date(), device: 'STU-430' } };
    // adapter l'url à ton backend
    this.http.post('/api/signature', payload).subscribe({
      next: () => alert('Envoyé au backend'),
      error: (err) => { console.error(err); alert('Erreur envoi'); }
    });
  }

  private clearCanvas() {
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}