import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaAsistenciaPageRoutingModule } from './vista-asistencia-routing.module';

import { VistaAsistenciaPage } from './vista-asistencia.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaAsistenciaPageRoutingModule,
    SharedModule
  ],
  declarations: [VistaAsistenciaPage]
})
export class VistaAsistenciaPageModule {}
