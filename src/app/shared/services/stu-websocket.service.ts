import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';

export interface StuPoint {
  x: number;
  y: number;
  pressure?: number;
  timestamp?: number;
}

export type StuMessage = 
  | { type: 'point'; x: number; y: number; pressure?: number; timestamp?: number }
  | { type: 'strokeStart' | 'strokeEnd' | 'status' | 'error'; [key: string]: any }
  | { type: 'image'; format: string; data: string };

@Injectable({ providedIn: 'root' })
export class StuWebsocketService {
  private ws: WebSocket | null = null;
  private url = 'ws://localhost:9000'; // adapter si nécessaire
  private reconnectInterval = 2000;
  private isConnected = false;

  // Streams
  private pointSubject = new Subject<StuPoint>();
  private statusSubject = new Subject<any>();
  private imageSubject = new Subject<string>();
  private errorSubject = new Subject<any>();

  constructor(private ngZone: NgZone) {
    this.connect();
  }

  get points$(): Observable<StuPoint> { return this.pointSubject.asObservable(); }
  get status$(): Observable<any> { return this.statusSubject.asObservable(); }
  get image$(): Observable<string> { return this.imageSubject.asObservable(); }
  get errors$(): Observable<any> { return this.errorSubject.asObservable(); }

  connect() {
    if (this.ws) return;
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => {
        this.ngZone.run(() => {
          this.isConnected = true;
          this.statusSubject.next({ status: 'connected' });
        });
      };
      this.ws.onmessage = (ev) => {
        this.ngZone.run(() => this.handleMessage(ev.data));
      };
      this.ws.onclose = () => {
        this.ngZone.run(() => {
          this.isConnected = false;
          this.statusSubject.next({ status: 'disconnected' });
          this.ws = null;
          // reconnect
          timer(this.reconnectInterval).subscribe(() => this.connect());
        });
      };
      this.ws.onerror = (err) => {
        this.ngZone.run(() => {
          this.errorSubject.next(err);
        });
      };
    } catch (e) {
      console.error('WS connect error', e);
      this.ws = null;
      timer(this.reconnectInterval).subscribe(() => this.connect());
    }
  }

  private handleMessage(raw: any) {
    let msg: any;
    try { msg = typeof raw === 'string' ? JSON.parse(raw) : raw; }
    catch (e) { console.warn('Invalid JSON', raw); return; }

    switch (msg.type) {
      case 'point':
        this.pointSubject.next({ x: msg.x, y: msg.y, pressure: msg.pressure, timestamp: msg.timestamp });
        break;
      case 'image':
        if (msg.data) this.imageSubject.next(msg.data);
        break;
      case 'status':
        this.statusSubject.next(msg);
        break;
      case 'error':
        this.errorSubject.next(msg);
        break;
      case 'strokeStart':
      case 'strokeEnd':
        this.statusSubject.next(msg);
        break;
      default:
        // inconnue
        break;
    }
  }

  sendCommand(cmd: any) {
    if (this.ws && this.isConnected) {
      this.ws.send(typeof cmd === 'string' ? cmd : JSON.stringify(cmd));
    } else {
      console.warn('WS not connected, cannot send', cmd);
    }
  }

  requestStart() { this.sendCommand({ cmd: 'start' }); }
  requestStop()  { this.sendCommand({ cmd: 'stop' }); }
  requestClear() { this.sendCommand({ cmd: 'clear' }); }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}