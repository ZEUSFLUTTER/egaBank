import { Component } from '@angular/core';
import { Header } from "../../shared/modules/header/header";
import { Footer } from "../../shared/modules/footer/footer";

@Component({
  selector: 'app-compte',
  imports: [Header, Footer],
  templateUrl: './compte.html',
  styleUrl: './compte.scss',
})
export class Compte {

}
