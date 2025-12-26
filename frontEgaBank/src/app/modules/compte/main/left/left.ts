import { Component, Input } from '@angular/core';
import { ListCompte } from "./list-compte/list-compte";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-left',
  standalone: true,
  imports: [ListCompte, CommonModule],
  templateUrl: './left.html',
  styleUrl: './left.scss',
})
export class Left {
  @Input() isListed: boolean = false;
}
