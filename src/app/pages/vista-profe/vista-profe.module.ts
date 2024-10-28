import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaProfePageRoutingModule } from './vista-profe-routing.module';

import { VistaProfePage } from './vista-profe.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaProfePageRoutingModule,
    SharedModule
  ],
  declarations: [VistaProfePage]
})
export class VistaProfePageModule {}
