import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaProfePageRoutingModule } from './vista-profe-routing.module';

import { VistaProfePage } from './vista-profe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaProfePageRoutingModule
  ],
  declarations: [VistaProfePage]
})
export class VistaProfePageModule {}
