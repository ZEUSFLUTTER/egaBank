import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Compte } from './compte';

const routes: Routes = [
  {
    path : '',
    component : Compte
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompteRoutingModule { }
