import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaProfePage } from './vista-profe.page';

const routes: Routes = [
  {
    path: '',
    component: VistaProfePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaProfePageRoutingModule {}
