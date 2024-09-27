import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaQrPageRoutingModule } from './vista-qr-routing.module';

import { VistaQrPage } from './vista-qr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaQrPageRoutingModule
  ],
  declarations: [VistaQrPage]
})
export class VistaQrPageModule {}
