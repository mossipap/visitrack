import {Injectable} from '@angular/core';
import { AppUtil } from './App-util';
@Injectable()
export class RoleManager {

  public droitsID: number[];

  constructor() {
    this.droitsID = new AppUtil().getDroitsID();
  }

  /**
   * @return boolean
   */
  public isDroitVoirMenuTableauBord(): boolean {
    return this.droitsID.includes(1);
  }
  public isDroiGenereStatistique(): boolean {
    return this.droitsID.includes(2);
  }
  // ================Utilisateur==================
  public isDroitVoirMenuParametre(): boolean {
    return this.droitsID.includes(3);
  }
  public isDroitVoirMenuUtilisateur(): boolean {
    return this.droitsID.includes(4);
  }
  public isDroitAjouterUtilisateur(): boolean {
    return this.droitsID.includes(5);
  }
  public isDroitModifierUtilisateur(): boolean {
    return this.droitsID.includes(6);
  }
  public isDroitChercherUtilisateur(): boolean {
    return this.droitsID.includes(7);
  }
  public isDroitChangerPwdUtilisateur(): boolean {
    return this.droitsID.includes(8);
  }
  public isDroitResetPwdUtilisateur(): boolean {
    return this.droitsID.includes(9);
  }
  public isDroitChangerPhotoUtilisateur(): boolean {
    return this.droitsID.includes(10);
  }
  public isDroitSauvegarderUtilisateur(): boolean {
    return this.droitsID.includes(11);
  }
  public isDroitDesactiverUtilisateur(): boolean {
    return this.droitsID.includes(12);
  }
  public isDroitActiverUtilisateur(): boolean {
    return this.droitsID.includes(13);
  }
  // ================Profile==================
  public isDroitVoirMenuProfile(): boolean {
    return this.droitsID.includes(14);
  }
  public isDroitAjouterProfile(): boolean {
    return this.droitsID.includes(15);
  }
  public isDroitModifierProfile(): boolean {
    return this.droitsID.includes(16);
  }
  public isDroitDesactiverProfile(): boolean {
    return this.droitsID.includes(17);
  }
  public isDroitActiverProfile(): boolean {
    return this.droitsID.includes(18);
  }
  public isDroitChercherProfile(): boolean {
    return this.droitsID.includes(19);
  }
  // ================Cabinet==================
  public isDroitVoirMenuCabinet(): boolean {
    return this.droitsID.includes(20);
  }
  public isDroitAjouterCabinet(): boolean {
    return this.droitsID.includes(21);
  }
  public isDroitModifierCabinet(): boolean {
    return this.droitsID.includes(22);
  }
  public isDroitDesactiverCabinet(): boolean {
    return this.droitsID.includes(23);
  }
  public isDroitActiverCabinet(): boolean {
    return this.droitsID.includes(24);
  }
  public isDroitSupprimerCabinet(): boolean {
    return this.droitsID.includes(25);
  }
  public isDroitChercherCabinet(): boolean {
    return this.droitsID.includes(26);
  }

  // ================Service==================
  public isDroitVoirMenuServices(): boolean {
    return this.droitsID.includes(27);
  }
  public isDroitAjouterServices(): boolean {
    return this.droitsID.includes(28);
  }
  public isDroitModifierServices(): boolean {
    return this.droitsID.includes(29);
  }
  public isDroitDesactiverServices(): boolean {
    return this.droitsID.includes(30);
  }
  public isDroitActiverServices(): boolean {
    return this.droitsID.includes(31);
  }
  public isDroitSupprimerServices(): boolean {
    return this.droitsID.includes(32);
  }
  public isDroitChercherServices(): boolean {
    return this.droitsID.includes(33);
  }
  public isDroitVoirDetailServices(): boolean {
    return this.droitsID.includes(34);
  }

  // ================Reclamation==================
  public isDroitVoirMenuReclamation(): boolean {
    return this.droitsID.includes(35);
  }
  public isDroitAjouterReclamation(): boolean {
    return this.droitsID.includes(36);
  }
  public isDroitModifierReclamation(): boolean {
    return this.droitsID.includes(37);
  }
  public isDroitDesactiverReclamation(): boolean {
    return this.droitsID.includes(38);
  }
  public isDroitActiverReclamation(): boolean {
    return this.droitsID.includes(39);
  }
  public isDroitSupprimerReclamation(): boolean {
    return this.droitsID.includes(40);
  }
  public isDroitChercherReclamation(): boolean {
    return this.droitsID.includes(41);
  }
  // ================RendezVous==================
  public isDroitVoirMenuRendezVous(): boolean {
    return this.droitsID.includes(42);
  }
  public isDroitDetailRendezVous(): boolean {
    return this.droitsID.includes(43);
  }
  public isDroitImprimerRendezVous(): boolean {
    return this.droitsID.includes(44);
  }
  public isDroitAjouterRendezVous(): boolean {
    return this.droitsID.includes(45);
  }
  public isDroitModifierRendezVous(): boolean {
    return this.droitsID.includes(46);
  }
  public isDroitSupprimerRendezVous(): boolean {
    return this.droitsID.includes(47);
  }
  public isDroitExportRendezVous(): boolean {
    return this.droitsID.includes(48);
  }
  public isDroitVoirDetailRendezVous(): boolean {
    return this.droitsID.includes(49);
  }
  // ================Visiteur==================
  public isDroitVoirMenuVisiteur(): boolean {
    return this.droitsID.includes(50);
  }
  public isDroitDetailVisiteur(): boolean {
    return this.droitsID.includes(51);
  }
  public isDroitAjouterVisiteur(): boolean {
    return this.droitsID.includes(52);
  }
  public isDroitModifierVisiteur(): boolean {
    return this.droitsID.includes(53);
  }
  public isDroitSupprimerVisiteur(): boolean {
    return this.droitsID.includes(54);
  }
  public isDroitExporterVisiteur(): boolean {
    return this.droitsID.includes(55);
  }
  public isDroitImprimerVisiteur(): boolean {
    return this.droitsID.includes(56);
  }
  
  // ================Calendrier==================
  public isDroitVoirMenuCalendrier(): boolean {
    return this.droitsID.includes(57);
  }
  public isDroitCreerEvenement(): boolean {
    return this.droitsID.includes(58);
  }
  public isDroitVoirEvenement(): boolean {
    return this.droitsID.includes(59);
  }
  // ================Rapport==================
  public isDroitVoirMenuRapport(): boolean {
    return this.droitsID.includes(60);
  }
  public isDroitSupprimerProfile(): boolean {
    return this.droitsID.includes(61);
  }
  public isDroitVoirDetailUtilisateur(): boolean {
    return this.droitsID.includes(62);
  }
}

