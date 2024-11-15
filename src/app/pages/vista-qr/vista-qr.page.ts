import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-vista-qr',
  templateUrl: './vista-qr.page.html',
  styleUrls: ['./vista-qr.page.scss'],
})
export class VistaQrPage implements OnInit {
  studentData: any;
  constructor(private router: Router,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    // Obtener los datos del alumno de la navegación
    const navigationState = history.state;
    if (navigationState && navigationState.student) {
      this.studentData = navigationState.student;
      console.log('Datos del estudiante en Vista QR:', this.studentData);
    } else {
      console.log('No se recibieron datos de estudiante en Vista QR');
    }
  }

  volver_al_home(){
    this.navCtrl.back();
  }
  
}
