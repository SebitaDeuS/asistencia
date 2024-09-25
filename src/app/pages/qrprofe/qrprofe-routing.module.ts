import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QRProfePage } from './qrprofe.page';

const routes: Routes = [
  {
    path: '',
    component: QRProfePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QRProfePageRoutingModule {}
