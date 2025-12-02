import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { RoleManager } from 'src/app/shared/utils/role-manager';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
   animations: [
    trigger('slideToggle', [
      state('closed', style({ height: '0', opacity: 0, overflow: 'hidden' })),
      state('open', style({ height: '*', opacity: 1 })),
      transition('closed <=> open', [animate('250ms ease-in-out')]),
    ])
  ]
})
export class SidebarComponent implements OnInit {
 public isDark: boolean = false;
  public activeMenu: string = '';
  public settingsOpen: boolean = false;
  public isSidebarOpen: boolean = false;
  public isExpanded: boolean = true;
  public roleManager:RoleManager


  constructor(private router: Router) {
    this.roleManager = new RoleManager();
  }

  ngOnInit(): void {
    this.loadTheme();
  }

  loadTheme(): void {
    const theme = localStorage.getItem('current_theme');
    this.isDark = theme === 'dark';
  }

  toggleSettingsMenu(): void {
    this.settingsOpen = !this.settingsOpen;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  clickLi(itemId: string): void {
    this.activeMenu = itemId;
   
  }
}