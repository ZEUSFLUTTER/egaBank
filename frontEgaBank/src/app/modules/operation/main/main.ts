import { Component } from '@angular/core';
import { Right } from "./right/right";
import { Left } from "./left/left";
import { CommonModule } from '@angular/common';
import { Info } from "./info/info";

@Component({
  selector: 'app-main',
  imports: [Right, Left, CommonModule, Info],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {

  isVersement: boolean = false;
  isRetrait: boolean = false;
  isVirement: boolean = false;

  showVersement($event: boolean) {
    this.isVersement = $event;
    this.isRetrait = false;
    this.isVirement = false;
  }

  showRetrait($event: boolean) {
    this.isVersement = false;
    this.isRetrait = $event;
    this.isVirement = false;
  }

  showVirement($event: boolean) {
    this.isVersement = false;
    this.isRetrait = false;
    this.isVirement = $event;
  }

}
