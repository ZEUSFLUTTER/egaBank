import { Component, Input } from '@angular/core';
import { ListCompte } from "./list-compte/list-compte";
import { CommonModule } from '@angular/common';
import { Historique } from "./historique/historique";

@Component({
  selector: 'app-left',
  standalone: true,
  imports: [ListCompte, CommonModule, Historique],
  templateUrl: './left.html',
  styleUrl: './left.scss',
})
export class Left {
  @Input() isListed: boolean = false;
  @Input() isHistoric: boolean = false;
}
