import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from 'src/app/services/fire-base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-vista-asistencia',
  templateUrl: './vista-asistencia.page.html',
  styleUrls: ['./vista-asistencia.page.scss'],
})
export class VistaAsistenciaPage implements OnInit {
  studentId: string;
  asignaturas: any[] = []; // Para almacenar las asignaturas y sus clases

  constructor(
    private router: Router,
    private firestoreService: FireBaseService
  ) {
    // Obtener el estado de navegación para recibir datos del estudiante
    const navigationState = history.state;
    if (navigationState && navigationState.student) {
      this.studentId = navigationState.student; 
      console.log('Datos del estudiante en vista asistencia:', this.studentId);
    } else {
      console.log('No se recibieron datos de estudiante en vista asistencia');
    }
  }

  ngOnInit() {
    if (this.studentId) {
      console.log('Datos del estudiante en VistaAsistencia del ngOnInit:', this.studentId);
  
      // Llamar al servicio para obtener las asignaturas y clases del estudiante
      this.firestoreService.getAsistenciasEstudiante(this.studentId).subscribe(
        asignaturas => {
          // Asegurarse de que el formato de asignaturas contiene 'asistencias'
          console.log('Asignaturas y clases recuperadas:', asignaturas); 
          this.asignaturas = asignaturas; // Almacenar los datos obtenidos
        },
        error => {
          console.error('Error al obtener las asignaturas:', error); // Manejo de errores
        }
      );
    } else {
      console.log('No se recibieron datos de estudiante en el ngOnInit');
    }
  }
  
}
