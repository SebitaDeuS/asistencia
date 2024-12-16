import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseService } from 'src/app/services/fire-base.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-vista-asistencia',
  templateUrl: './vista-asistencia.page.html',
  styleUrls: ['./vista-asistencia.page.scss'],
})
export class VistaAsistenciaPage implements OnInit {
  studentId: string;
  clases:any[];
  clasesAlumno: any[] = [];
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
    this.firestoreService.getclasealumno(this.studentId).subscribe(clases=>{
      console.log('distintas clases:',clases)
      this.clases=clases;
      
  });
    if (this.studentId) {
      console.log('Datos del estudiante en VistaAsistencia del ngOnInit:', this.studentId);
    } else {
      console.log('No se recibieron datos de estudiante en el ngOnInit');
    }
  }
  

  volver_al_home() {
    this.navCtrl.back();
  }
}
