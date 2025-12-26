import { Component, Input } from '@angular/core';
import { Versement } from "./versement/versement";
import { Historique } from "../../../compte/main/left/historique/historique";
import { Retrait } from "./retrait/retrait";
import { Virement } from "./virement/virement";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-left',
  imports: [Versement, Retrait, Virement,CommonModule],
  templateUrl: './left.html',
  styleUrl: './left.scss',
})
export class Left {

  @Input() isVersemented : boolean = false;
  @Input() isRetraited : boolean = false;
  @Input() isViremented : boolean = false;
}
