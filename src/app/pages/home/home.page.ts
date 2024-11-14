import { Firestore } from '@angular/fire/firestore';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/almacenamiento.service';
import {FireBaseService} from 'src/app/services/fire-base.service';
import{MetodosFirebaseService} from 'src/app/services/metodos-firebase.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  id_alumno: string | null = null;  // id_alumno debe ser un string o null
  alumnos: any[] = [];              // alumnos sigue siendo un array (aunque esté vacío inicialmente)
  correo_alumno: string = '';
  alumnoData: any =null;
  constructor(
    private router: Router, 
    private afAuth: AngularFireAuth,
    private authservice:AuthService,
    private firebasesv:FireBaseService,
    private metodosFBS:MetodosFirebaseService,
    
  ) {}

  ngOnInit() {
    // Obtén el ID del alumno desde la navegación o el sessionStorage
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.id_alumno = navigation.extras.state['id_alumno'];
      this.alumnoData = navigation.extras.state['alumnoData'];
    } else {
      this.id_alumno = sessionStorage.getItem('id_alumno');
      this.alumnoData = JSON.parse(sessionStorage.getItem('alumnoData') || '{}');
    }

    if (this.id_alumno) {
      // Obtener el correo del alumno
      this.firebasesv.getCorreoAlumno(this.id_alumno).subscribe(correo => {
        this.correo_alumno = correo;
        console.log('Correo del Alumno en Home:', this.correo_alumno);
      });

      // Obtener los datos del alumno
      this.metodosFBS.getData(this.id_alumno).subscribe(data => {
        this.alumnoData = data[0]; // Asumimos que obtenemos un solo resultado
        console.log('Datos del Alumno en Home:', this.alumnoData);
      });
    } else {
      console.warn('ID del Alumno no encontrado');
    }

    console.log('ID del Alumno en Home:', this.id_alumno);
  }
  

  
  escanearQr() {
    // Navegar a la página de escaneo de QR
    this.router.navigate(['/vista-qr']); 
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
