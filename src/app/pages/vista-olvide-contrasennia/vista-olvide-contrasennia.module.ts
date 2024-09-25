import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaOlvideContrasenniaPageRoutingModule } from './vista-olvide-contrasennia-routing.module';

import { VistaOlvideContrasenniaPage } from './vista-olvide-contrasennia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaOlvideContrasenniaPageRoutingModule
  ],
  declarations: [VistaOlvideContrasenniaPage]
})
export class VistaOlvideContrasenniaPageModule {}
