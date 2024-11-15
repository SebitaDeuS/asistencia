import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, Navigation } from '@angular/router';
import {StudentData }from 'src/app/interfaces/i_usuario'
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  studentData: any={
    correo_alumno: "",
    nombre_alumno: ""
  }

  constructor(
    private router: Router,
    private navCtrl: NavController
  ) {
    const navigation: Navigation | null = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.studentData = navigation.extras.state['studentData'];
    }
  }

  ngOnInit() {
    if (this.studentData) {
      console.log('Datos del estudiante en Home:', this.studentData);
    } else {
      console.log('No se recibieron datos de estudiante');
    }
  }



  escanearQr() {
    if (this.studentData) {
    console.log('llendo a vista_qr')
      // Navegar a VistaQrPage con los datos del alumno
      this.navCtrl.navigateForward('/vista-qr', {
        state: { student: this.studentData }
      });
    }
  }

  asistencia() {
    // Navegar a la página de asistencia
    this.router.navigate(['/vista-asistencia']); 
  }

  profe() {
    // Navegar a la página de asistencia
    this.router.navigate(['/vista-profe']); 
  }


}
