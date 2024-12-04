import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from 'src/app/services/fire-base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-vista-asistencia',
  templateUrl: './vista-asistencia.page.html',
  styleUrls: ['./vista-asistencia.page.scss'],
})
export class VistaAsistenciaPage implements OnInit {
  studentId: string;
  asignaturas: any[] = []; 

  constructor(
    private router: Router,
    private firestoreService: FireBaseService,
    private navCtrl: NavController,
  ) {
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
  
      this.firestoreService.getAsistenciasEstudiante(this.studentId).subscribe(
        asignaturas => {
          console.log('Asignaturas y clases recuperadas:', asignaturas); 
          this.asignaturas = asignaturas; 
        },
        error => {
          console.error('Error al obtener las asignaturas:', error); 
        }
      );
    } else {
      console.log('No se recibieron datos de estudiante en el ngOnInit');
    }
  }
  volver_al_home() {
    this.navCtrl.back();
  }
}
