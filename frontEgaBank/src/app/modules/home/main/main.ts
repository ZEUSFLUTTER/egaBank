import { Component } from '@angular/core';
import { Right } from "./right/right";
import { Left } from "./left/left";
import { ClientRoutingModule } from "../../client/client-routing-module";

@Component({
  selector: 'app-main',
  imports: [ClientRoutingModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {

}
