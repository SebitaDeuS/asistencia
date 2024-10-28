import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CodigoprofePageRoutingModule } from './codigoprofe-routing.module';

import { CodigoprofePage } from './codigoprofe.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodigoprofePageRoutingModule,
    SharedModule
  ],
  declarations: [CodigoprofePage]
})
export class CodigoprofePageModule {}
