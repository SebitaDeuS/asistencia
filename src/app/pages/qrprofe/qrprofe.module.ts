import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QRProfePageRoutingModule } from './qrprofe-routing.module';

import { QRProfePage } from './qrprofe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QRProfePageRoutingModule
  ],
  declarations: [QRProfePage]
})
export class QRProfePageModule {}
