import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaOlvideContrasenniaPage } from './vista-olvide-contrasennia.page';

const routes: Routes = [
  {
    path: '',
    component: VistaOlvideContrasenniaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaOlvideContrasenniaPageRoutingModule {}
