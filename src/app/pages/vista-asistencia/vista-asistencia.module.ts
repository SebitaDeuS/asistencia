import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaAsistenciaPageRoutingModule } from './vista-asistencia-routing.module';

import { VistaAsistenciaPage } from './vista-asistencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaAsistenciaPageRoutingModule
  ],
  declarations: [VistaAsistenciaPage]
})
export class VistaAsistenciaPageModule {}
