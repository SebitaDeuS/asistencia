import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaPresPage } from './lista-pres.page';

const routes: Routes = [
  {
    path: '',
    component: ListaPresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaPresPageRoutingModule {}
