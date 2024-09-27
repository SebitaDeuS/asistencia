import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaPerfilUsuarioPage } from './vista-perfil-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: VistaPerfilUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaPerfilUsuarioPageRoutingModule {}
