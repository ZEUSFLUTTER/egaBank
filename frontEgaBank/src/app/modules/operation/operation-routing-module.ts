import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Operation } from './operation';

const routes: Routes = [
  {
    path : '',
    component : Operation
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRoutingModule { }
