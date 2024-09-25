import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodigoprofePage } from './codigoprofe.page';

const routes: Routes = [
  {
    path: '',
    component: CodigoprofePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CodigoprofePageRoutingModule {}
