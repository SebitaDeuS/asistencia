import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaPresPageRoutingModule } from './lista-pres-routing.module';

import { ListaPresPage } from './lista-pres.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaPresPageRoutingModule
  ],
  declarations: [ListaPresPage]
})
export class ListaPresPageModule {}
