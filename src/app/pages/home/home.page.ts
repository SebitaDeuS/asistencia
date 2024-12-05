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
    const navigationextra:NavigationExtras={
      state:{
        student: this.studentData.id_alumno 
      }
    };
    this.router.navigate(["/vista-asistencia"],navigationextra)
    console.log('llendo a /vista-asistencia');
  }

  // ejemplo() {
  //   const navigationExtras: NavigationExtras = {
  //     state: {
  //      datos 
  //     }
  //   };
  //   console.log('Datos a lista-pres:', navigationExtras);
  //   this.router.navigate(["/lista-pres"], navigationExtras);
  // }

  profe() {
    this.router.navigate(['/vista-profe']); 
  }


}
