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
      this.navCtrl.navigateForward('/vista-qr', {
        state: { student: this.studentData }
      });
    }
  }

  asistencia() {
    if (this.studentData) {
      console.log('llendo a vista_asistencia');
      this.navCtrl.navigateForward('/vista-asistencia', {
        state: { student: this.studentData.id_alumno }
      });
      console.log('datos del alumno mandados', this.studentData.id_alumno);
    }
  }

  profe() {
    this.router.navigate(['/vista-profe']); 
  }


}
