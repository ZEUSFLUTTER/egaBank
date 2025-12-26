import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer } from "../../../shared/modules/footer/footer";
import { Left } from "./left/left";
import { Header } from "../../../shared/modules/header/header";
import { Right } from "./right/right";
import { Info } from "./info/info";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,

    Left,

    Right,
    Info
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {

  isAdd = false;
  isList = false;

  addClient($event : boolean){
    this.isAdd = $event;
    this.isList = false;
  }

  showClient($event : boolean){
    this.isAdd = false;
    this.isList = $event;
  }
}
