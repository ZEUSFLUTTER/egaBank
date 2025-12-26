import { Component } from '@angular/core';
import { Header } from "../../shared/modules/header/header";
import { Footer } from "../../shared/modules/footer/footer";
import { Main } from "./main/main";

@Component({
  selector: 'app-compte',
  imports: [Header, Footer, Main],
  templateUrl: './compte.html',
  styleUrl: './compte.scss',
})
export class Compte {

}
