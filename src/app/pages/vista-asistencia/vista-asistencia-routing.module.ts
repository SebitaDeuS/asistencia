import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaAsistenciaPage } from './vista-asistencia.page';

const routes: Routes = [
  {
    path: '',
    component: VistaAsistenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaAsistenciaPageRoutingModule {}
