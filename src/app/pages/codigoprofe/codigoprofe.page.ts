import { AlertController } from '@ionic/angular';
import { NavigationExtras, NavigationStart, Router } from '@angular/router';
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

  ) { 
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log('Navegación detectada desde Codigoprofe:', event.url);
        console.trace();
      }
    });
  }

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

    // Recuperar QR 
    this.qrData = sessionStorage.getItem('qrData') || '';  
    this.qrGenerado = !!this.qrData;
  }

  generarQR() {
    if (this.profesorId && this.asignaturaId && this.cursoId) {
      const fechaActual = new Date();
      const fechaFormateada = fechaActual.toLocaleDateString();
  
      this.qrData = `profesorId=${this.profesorId} asignaturaId=${this.asignaturaId} cursoid=${this.cursoId} fecha=${fechaFormateada} `;
      sessionStorage.setItem('qrData', this.qrData);
      this.qrGenerado = true;
  
      console.log('QR generado correctamente:', this.qrData);
  
      // Actualiza la fecha en Firestore
      this.firebsv.updateFechaClase(this.cursoId, this.asignaturaId, this.asignaturaId, fechaFormateada)
        .then(() => console.log('Fecha actualizada correctamente en Firestore'))
        .catch((error) => console.error('Error al actualizar la fecha:', error));
    } else {
      console.error('Faltan datos para generar el QR:', {
        profesorId: this.profesorId,
        asignaturaId: this.asignaturaId,
        cursoId: this.cursoId,
      });
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