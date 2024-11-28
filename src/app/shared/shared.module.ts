import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './components/menu/menu.component';
import { CrearAsignaturaComponent } from './components/crear-asignatura/crear-asignatura.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [MenuComponent,
    CrearAsignaturaComponent
  ],
  exports: [MenuComponent,
    CrearAsignaturaComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule 
  ]
})
export class SharedModule { }
