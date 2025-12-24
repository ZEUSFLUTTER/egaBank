import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing-module';
import { FooterModule, HeaderModule } from '../../shared';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClientRoutingModule,
    HeaderModule,
    FooterModule
  ]
})
export class ClientModule { }
