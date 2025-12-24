import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing-module';
import { FooterModule, HeaderModule } from '../../shared';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HeaderModule,
    FooterModule
  ]
})
export class HomeModule { }
