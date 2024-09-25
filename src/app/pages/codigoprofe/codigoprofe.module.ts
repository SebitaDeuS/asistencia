import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CodigoprofePageRoutingModule } from './codigoprofe-routing.module';

import { CodigoprofePage } from './codigoprofe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodigoprofePageRoutingModule
  ],
  declarations: [CodigoprofePage]
})
export class CodigoprofePageModule {}
