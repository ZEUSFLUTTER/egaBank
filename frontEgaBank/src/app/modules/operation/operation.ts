import { Component } from '@angular/core';
import { Header } from "../../shared/modules/header/header";
import { Footer } from "../../shared/modules/footer/footer";
import { Main } from "./main/main";

@Component({
  selector: 'app-operation',
  imports: [Header, Footer, Main],
  templateUrl: './operation.html',
  styleUrl: './operation.scss',
})
export class Operation {

}
