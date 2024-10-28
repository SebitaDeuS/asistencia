import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaPerfilUsuarioPageRoutingModule } from './vista-perfil-usuario-routing.module';

import { VistaPerfilUsuarioPage } from './vista-perfil-usuario.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaPerfilUsuarioPageRoutingModule,
    SharedModule
  ],
  declarations: [VistaPerfilUsuarioPage]
})
export class VistaPerfilUsuarioPageModule {}
