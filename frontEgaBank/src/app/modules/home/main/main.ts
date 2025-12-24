import { Component } from '@angular/core';
import { Right } from "./right/right";
import { Left } from "./left/left";

@Component({
  selector: 'app-main',
  imports: [Right, Left],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {

}
