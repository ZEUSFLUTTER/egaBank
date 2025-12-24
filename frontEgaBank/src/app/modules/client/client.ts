import { Component } from '@angular/core';
import { Header } from "../../shared/modules/header/header";
import { Footer } from "../../shared/modules/footer/footer";
import { Main } from "./main/main";

@Component({
  selector: 'app-client',
  imports: [Header, Footer, Main],
  templateUrl: './client.html',
  styleUrl: './client.scss',
})
export class Client {

}
