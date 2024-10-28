import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaQrPageRoutingModule } from './vista-qr-routing.module';

import { VistaQrPage } from './vista-qr.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaQrPageRoutingModule,
    SharedModule
  ],
  declarations: [VistaQrPage]
})
export class VistaQrPageModule {}
