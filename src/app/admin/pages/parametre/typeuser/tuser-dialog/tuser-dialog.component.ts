import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import * as SecureLS from 'secure-ls';
import { Service } from 'src/app/shared/models/service';
import { ServiceService } from 'src/app/shared/services/service.service';

@Component({
  selector: 'app-tuser-dialog',
  templateUrl: './tuser-dialog.component.html',
  styleUrls: ['./tuser-dialog.component.css']
})
export class TuserDialogComponent implements OnInit {

  public typeuser: Service;
  public isDark: boolean;
  public loading: boolean;

  constructor(
    public dialogRef: MatDialogRef<TuserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceService: ServiceService
  ) { }

  ngOnInit(): void {
    this.typeuser = this.data.typeuser;
    const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: 'MyAdminApp' });
    if (ls.get('current_theme')) {//dark
      this.isDark = true;
      const headerLeft = document.getElementsByClassName("theme-light");
      for(var i = headerLeft.length - 1; i >= 0; --i) {
        headerLeft[i].classList.replace('theme-light', 'theme-dark');
      }
      const formInput = document.getElementsByClassName("form-control-w");
      for(var i = formInput.length - 1; i >= 0; --i) {
        formInput[i].classList.replace('form-control-w', 'form-control-d');
      }
      const btnClose = document.getElementsByClassName("btn-close-w");
      for(var i = btnClose.length - 1; i >= 0; --i) {
        btnClose[i].classList.replace('btn-close-w', 'btn-close-d');
      }
      const labelColor = document.getElementsByClassName("c-cab-2");
      for(var i = labelColor.length - 1; i >= 0; --i) {
        labelColor[i].classList.replace('c-cab-2', 'c-cab-1');
      }
    } else {//white
      this.isDark = false;
      const headerLeft = document.getElementsByClassName("theme-dark");
      for(var i = headerLeft.length - 1; i >= 0; --i) {
        headerLeft[i].classList.replace('theme-dark', 'theme-light');
      }
      const formInput = document.getElementsByClassName("form-control-d");
      for(var i = formInput.length - 1; i >= 0; --i) {
        formInput[i].classList.replace('form-control-d', 'form-control-w');
      }
      const btnClose = document.getElementsByClassName("btn-close-d");
      for(var i = btnClose.length - 1; i >= 0; --i) {
        btnClose[i].classList.replace('btn-close-d', 'btn-close-w');
      }
      const labelColor = document.getElementsByClassName("c-cab-1");
      for(var i = labelColor.length - 1; i >= 0; --i) {
        labelColor[i].classList.replace('c-cab-1', 'c-cab-2');
      }
    }
  }
  onNoClick(): void {
    this.dialogRef.close("annuler");
  }
  saveOrUpdate() {}

}
