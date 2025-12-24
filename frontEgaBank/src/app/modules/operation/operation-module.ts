import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationRoutingModule } from './operation-routing-module';
import { FooterModule, HeaderModule } from '../../shared';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OperationRoutingModule,
    HeaderModule,
    FooterModule
  ]
})
export class OperationModule { }
