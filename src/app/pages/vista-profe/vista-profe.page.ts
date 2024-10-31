import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FireBaseService } from 'src/app/services/fire-base.service';

@Component({
  selector: 'app-vista-profe',
  templateUrl: './vista-profe.page.html',
  styleUrls: ['./vista-profe.page.scss'],
})
export class VistaProfePage implements OnInit {

  asignaturas: any[] = [];

  constructor(private router:Router, private firebaseService: FireBaseService) { }

  ngOnInit() {
    // Obtener el ID del profesor autenticado y luego obtener sus asignaturas
    this.firebaseService.getProfesorId().subscribe(profesorId => {
      if (profesorId) {
        this.firebaseService.getAsignaturasProfesor(profesorId).subscribe(asignaturas => {
          this.asignaturas = asignaturas;
        });
      } else {
        console.error('No se pudo obtener el ID del profesor');
      }
    });
  }

  al_codigo(asignaturaId: string) {
    this.router.navigate(['/codigoprofe', { asignaturaId }]);
  }
}
