import { Component, OnInit } from '@angular/core';
import { Router, Navigation } from '@angular/router';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FireBaseService } from 'src/app/services/fire-base.service';
@Component({
  selector: 'app-vista-asistencia',
  templateUrl: './vista-asistencia.page.html',
  styleUrls: ['./vista-asistencia.page.scss'],
})
export class VistaAsistenciaPage implements OnInit {
  studentId: string;
  studentData: any = {};
  asignaturas$: Observable<any[]>; 

  constructor(
    private router: Router,
    private firestore: AngularFirestore,  // Usar AngularFirestore de compatibilidad
    private firestoreService:FireBaseService
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
      console.log('Datos del estudiante en VistaAsistencia del ngoninit:', this.studentId);
      this.getAsignaturasEstudiante(this.studentId);
    } else {
      console.log('No se recibieron datos de estudiante del ngoninit');
    }
  }
  getAsignaturasEstudiante(id_alumno: string): void {
    this.asignaturas$ = this.firestoreService.getAsignaturasEstudiante(id_alumno); // Llama al servicio
    this.asignaturas$.subscribe(data => {
      console.log('Asignaturas recuperadas:', data); // Verifica los datos recibidos
    });
  }
  
}
