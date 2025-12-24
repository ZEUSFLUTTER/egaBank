import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompteRoutingModule } from './compte-routing-module';
import { FooterModule, HeaderModule } from '../../shared';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CompteRoutingModule,
    HeaderModule,
    FooterModule
  ]
})
export class CompteModule { }
