import { AlertController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FireBaseService } from 'src/app/services/fire-base.service';

@Component({
  selector: 'app-codigoprofe',
  templateUrl: './codigoprofe.page.html',
  styleUrls: ['./codigoprofe.page.scss'],
})
export class CodigoprofePage implements OnInit {
  asignaturaId: string | null = null;
  profesorId: string | null = null;
  qrData: string = '';
  seccionId: string = '';
  cursoId: string | null = null; 
  qrGenerado = false; 



  constructor(private router: Router,

    private firebsv: FireBaseService,

  ) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.profesorId = navigation.extras.state['profesorId'];
      this.asignaturaId = navigation.extras.state['asignaturaId'];
      this.cursoId = navigation.extras.state['cursoId'];
    } else {
      this.profesorId = sessionStorage.getItem('profesorId');
      this.asignaturaId = sessionStorage.getItem('asignaturaId');
      this.cursoId = sessionStorage.getItem('cursoId');
    }

    this.qrData = sessionStorage.getItem('qrData') || '';  // Recupera el QR si ya fue generado

    // Si ya existe un QR, activa el flag para habilitar el botón
    this.qrGenerado = !!this.qrData;
    console.log('Datos en CodigoprofePage:', {
      profesorId: this.profesorId,
      asignaturaId: this.asignaturaId,
      cursoId: this.cursoId,
      qrData: this.qrData
    });
  }

  generarQR() {
    if (this.profesorId && this.asignaturaId && this.cursoId) {
      const fechaActual = new Date();
      const fechaFormateada = fechaActual.toLocaleDateString();

      // Crear el QR con la fecha y guardar en sessionStorage
      this.qrData = `profesorId=${this.profesorId}&asignaturaId=${this.asignaturaId}&fecha=${fechaFormateada}`;
      sessionStorage.setItem('qrData', this.qrData);
      sessionStorage.setItem('profesorId', this.profesorId);
      sessionStorage.setItem('asignaturaId', this.asignaturaId);
      sessionStorage.setItem('cursoId', this.cursoId);
      
      // Actualiza Firestore con la fecha de la clase
      this.firebsv.updateFechaClase(this.cursoId, this.asignaturaId, this.asignaturaId, fechaFormateada)
        .then(() => {
          console.log('Fecha de clase guardada en Firestore');
          this.qrGenerado = true;  // Habilita el botón para ver QR
        })
        .catch(error => {
          console.error('Error al guardar la fecha de clase en Firestore:', error);
        });
    } else {
      console.error('Datos incompletos para generar QR');
    }
  }

  verQR() {
    const navigationExtras: NavigationExtras = {
      state: {
        profesorId: this.profesorId,
        asignaturaId: this.asignaturaId,
        cursoId: this.cursoId,
        qrData: this.qrData
      }
    };
    this.router.navigate(['/qrprofe'], navigationExtras);
  }


  al_vistaProfe() {
    const navigationExtras: NavigationExtras = {
      state: {
        profesorId: this.profesorId
      }
    };
    this.router.navigate(['/vista-profe'], navigationExtras);
  }

  al_codigo() {
    this.router.navigate(["/qrprofe"]);
  }

  a_lista() {
    this.router.navigate(["/lista-pres"]);
  }
}