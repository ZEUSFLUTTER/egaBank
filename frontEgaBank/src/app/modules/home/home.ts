import { Component } from '@angular/core';
import { Header } from "../../shared/modules/header/header";
import { Footer } from "../../shared/modules/footer/footer";
import { Main } from "./main/main";
import { ClientRoutingModule } from "../client/client-routing-module";

@Component({
  selector: 'app-home',
  imports: [Header, Footer, Main, ClientRoutingModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
