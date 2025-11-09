import { Component, OnInit } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-parametre',
  templateUrl: './menu-parametre.component.html',
  styleUrls: ['./menu-parametre.component.css'],
  animations: [
    // Header + bouton
    trigger('headerFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),

    // Cartes avec icône + texte animés
    trigger('cardsFade', [
      transition(':enter', [
        query('.setting-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(150, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
            query('.icon-wrapper', [
              style({ opacity: 0, transform: 'scale(0.5)' }),
              animate('400ms 150ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
            ]),
            query('h6, p', [
              style({ opacity: 0, transform: 'translateY(10px)' }),
              animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
          ])
        ])
      ])
    ])
  ]
})
export class MenuParametreComponent implements OnInit {

  constructor( private router: Router) { }

  ngOnInit(): void {
  }

  resetSettings() {
    console.log('Paramètres réinitialisés');
  }
}


