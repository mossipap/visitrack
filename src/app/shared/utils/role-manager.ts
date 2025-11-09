import {Injectable} from '@angular/core';
import { AppUtil } from './App-util';
@Injectable()
export class RoleManager {

  public droitsID: number[];

  constructor() {
    this.droitsID = new AppUtil().getDroitsID();
  }/* N° Abah Vendeur Velo: 62 78 41 99  */

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

  // ================Cote==================
  public isDroitVoirMenuCote(): boolean {
    return this.droitsID.includes(27);
  }
  public isDroitAjouterCote(): boolean {
    return this.droitsID.includes(28);
  }
  public isDroitModifierCote(): boolean {
    return this.droitsID.includes(29);
  }
  public isDroitDesactiverCote(): boolean {
    return this.droitsID.includes(30);
  }
  public isDroitActiverCote(): boolean {
    return this.droitsID.includes(31);
  }
  public isDroitSupprimerCote(): boolean {
    return this.droitsID.includes(32);
  }
  public isDroitChercherCote(): boolean {
    return this.droitsID.includes(33);
  }
  public isDroitVoirDetailCote(): boolean {
    return this.droitsID.includes(34);
  }

  // ================Infraction==================
  public isDroitVoirMenuInfraction(): boolean {
    return this.droitsID.includes(35);
  }
  public isDroitAjouterInfraction(): boolean {
    return this.droitsID.includes(36);
  }
  public isDroitModifierInfraction(): boolean {
    return this.droitsID.includes(37);
  }
  public isDroitDesactiverInfraction(): boolean {
    return this.droitsID.includes(38);
  }
  public isDroitActiverInfraction(): boolean {
    return this.droitsID.includes(39);
  }
  public isDroitSupprimerInfraction(): boolean {
    return this.droitsID.includes(40);
  }
  public isDroitChercherInfraction(): boolean {
    return this.droitsID.includes(41);
  }

  // ================Inculpe==================
  public isDroitVoirMenuInculpe(): boolean {
    return this.droitsID.includes(42);
  }
  public isDroitDetailInculpe(): boolean {
    return this.droitsID.includes(43);
  }
  public isDroitImprimerInculpe(): boolean {
    return this.droitsID.includes(44);
  }
  public isDroitAjouterInculpe(): boolean {
    return this.droitsID.includes(45);
  }
  public isDroitModifierInculpe(): boolean {
    return this.droitsID.includes(46);
  }
  public isDroitSupprimerInculpe(): boolean {
    return this.droitsID.includes(47);
  }
  public isDroitCreerCoteFichierInculpe(): boolean {
    return this.droitsID.includes(48);
  }
  public isDroitImprimerCoteInculpe(): boolean {
    return this.droitsID.includes(49);
  }
  public isDroitImprimerInventaireInculpe(): boolean {
    return this.droitsID.includes(50);
  }
  public isDroitImporterInventaireInculpe(): boolean {
    return this.droitsID.includes(51);
  }
  public isDroitVoirDetailCoteInculpe(): boolean {
    return this.droitsID.includes(52);
  }
  public isDroitSupprimerCoteInculpe(): boolean {
    return this.droitsID.includes(53);
  }

  // ================Dossier==================
  public isDroitVoirMenuDossier(): boolean {
    return this.droitsID.includes(54);
  }
  public isDroitDetailDossier(): boolean {
    return this.droitsID.includes(55);
  }
  public isDroitAjouterDossier(): boolean {
    return this.droitsID.includes(56);
  }
  public isDroitModifierDossier(): boolean {
    return this.droitsID.includes(57);
  }
  public isDroitSupprimerDossier(): boolean {
    return this.droitsID.includes(58);
  }
  public isDroitAccepterDossier(): boolean {
    return this.droitsID.includes(59);
  }
  public isDroitMonterDossier(): boolean {
    return this.droitsID.includes(60);
  }
  public isDroitAfficherTransmisDossier(): boolean {
    return this.droitsID.includes(61);
  }

  // ================Transmission==================
  public isDroitVoirMenuTransmission(): boolean {
    return this.droitsID.includes(62);
  }
  public isDroitEnvoyeMailTransmission(): boolean {
    return this.droitsID.includes(63);
  }
  public isDroitImprimerTransmission(): boolean {
    return this.droitsID.includes(64);
  }
  public isDroitImporterTransmission(): boolean {
    return this.droitsID.includes(65);
  }

  // ================Juge / Greffier==================
  public isDroitVoirMenuJuge(): boolean {
    return this.droitsID.includes(66);
  }
  public isDroitVoirMenuGreffier(): boolean {
    return this.droitsID.includes(67);
  }
  public isDroitVoirStatisticMenujg(): boolean {
    return this.droitsID.includes(68);
  }
  public isDroitAccepterOrdojg(): boolean {
    return this.droitsID.includes(69);
  }
  public isDroitVoirOrdojg(): boolean {
    return this.droitsID.includes(70);
  }
  public isDroitModifierSaisinejg(): boolean {
    return this.droitsID.includes(71);
  }

  // ================Assistance / Presidente==================
  public isDroitVoirMenuAssistance(): boolean {
    return this.droitsID.includes(72);
  }
  public isDroitVoirMenuPresidente(): boolean {
    return this.droitsID.includes(73);
  }
  public isDroitVoirStatisticMenuap(): boolean {
    return this.droitsID.includes(74);
  }
  public isDroitEffectueOrdoap(): boolean {
    return this.droitsID.includes(75);
  }
  public isDroitVoirOrdoap(): boolean {
    return this.droitsID.includes(76);
  }
  public isDroitModifierOrdoap(): boolean {
    return this.droitsID.includes(77);
  }
  public isDroitImporterSigneOrdoap(): boolean {
    return this.droitsID.includes(78);
  }
  public isDroitVoirSigneOrdoap(): boolean {
    return this.droitsID.includes(79);
  }
  public isDroitSupprimerOrdoap(): boolean {
    return this.droitsID.includes(80);
  }
  public isDroitVoirDetailSaisineap(): boolean {
    return this.droitsID.includes(81);
  }
  public isDroitModifierSaisineap(): boolean {
    return this.droitsID.includes(82);
  }
  public isDroitImporterSaisineap(): boolean {
    return this.droitsID.includes(83);
  }
  public isDroitVoirSigneSaisineap(): boolean {
    return this.droitsID.includes(84);
  }
  public isDroitSupprimerSaisineap(): boolean {
    return this.droitsID.includes(85);
  }
  public isDroitImprimerSaisineap(): boolean {
    return this.droitsID.includes(86);
  }
  public isDroitEffectuerReceptionap(): boolean {
    return this.droitsID.includes(87);
  }
  public isDroitVoirDetailReceptionap(): boolean {
    return this.droitsID.includes(88);
  }
  public isDroitModifierReceptionap(): boolean {
    return this.droitsID.includes(89);
  }
  public isDroitSupprimerReceptionap(): boolean {
    return this.droitsID.includes(90);
  }
  public isDroitImprimerReceptionap(): boolean {
    return this.droitsID.includes(91);
  }

  // ================Calendrier==================
  public isDroitVoirMenuCalendrier(): boolean {
    return this.droitsID.includes(92);
  }
  public isDroitCreerEvenement(): boolean {
    return this.droitsID.includes(93);
  }
  public isDroitVoirEvenement(): boolean {
    return this.droitsID.includes(94);
  }

  // ================Message==================
  public isDroitVoirMenuMessage(): boolean {
    return this.droitsID.includes(95);
  }
  public isDroitCreerGroupe(): boolean {
    return this.droitsID.includes(96);
  }
  public isDroiModifierGroupe(): boolean {
    return this.droitsID.includes(97);
  }

  public isDroitSupprimerProfile(): boolean {
    return this.droitsID.includes(113);
  }
  public isDroitVoirDetailUtilisateur(): boolean {
    return this.droitsID.includes(114);
  }
}

