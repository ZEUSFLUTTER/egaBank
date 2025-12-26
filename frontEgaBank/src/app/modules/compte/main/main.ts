import { ShowClient } from './../../client/main/left/show-client/show-client';
import { Component } from '@angular/core';
import { Right } from "./right/right";
import { Left } from "./left/left";
import { Info } from "./info/info";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-main',
  imports: [Right, Left, Info,CommonModule ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  public isList : boolean = false;

  showList ($event : boolean){
    this.isList = $event;
  }
}
