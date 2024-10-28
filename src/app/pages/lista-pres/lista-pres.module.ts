import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaPresPageRoutingModule } from './lista-pres-routing.module';

import { ListaPresPage } from './lista-pres.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaPresPageRoutingModule,
    SharedModule
  ],
  declarations: [ListaPresPage]
})
export class ListaPresPageModule {}
