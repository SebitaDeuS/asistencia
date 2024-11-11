import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FireBaseService } from 'src/app/services/fire-base.service';

@Component({
  selector: 'app-qrprofe',
  templateUrl: './qrprofe.page.html',
  styleUrls: ['./qrprofe.page.scss'],
})
export class QRProfePage implements OnInit {

  qrData: string = '';  
  asignaturaId: string | null = null;
  profesorId: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.profesorId = navigation.extras.state['profesorId'];
      this.asignaturaId = navigation.extras.state['asignaturaId'];
    } else {
      // Usar sessionStorage como respaldo si `state` no está disponible
      this.profesorId = sessionStorage.getItem('profesorId');
      this.asignaturaId = sessionStorage.getItem('asignaturaId');
    }

    // Verificar que los datos estén disponibles para generar el QR
    if (this.profesorId && this.asignaturaId) {
      // Obtener fecha y hora actuales
      const fechaActual = new Date();
      const fechaFormateada = fechaActual.toLocaleDateString(); // Ej: "20/10/2024"
      const horaFormateada = fechaActual.toLocaleTimeString(); // Ej: "10:15:30 AM"
      
      // Generar los datos del QR incluyendo fecha y hora
      this.qrData = `profesorId=${this.profesorId}&asignaturaId=${this.asignaturaId}&fecha=${fechaFormateada}&hora=${horaFormateada}`;
      console.log('Datos del QR:', this.qrData);
    } else {
      console.error('No se encontraron datos del profesor o asignatura en QRProfePage');
    }
  }

  al_codigo(asignaturaId: string) {
    const profesorId = this.route.snapshot.queryParamMap.get('profesorId');
    if (profesorId) {
      console.log('Navegando a codigoprofe con:', { profesorId, asignaturaId });
  
      // Guardar en sessionStorage como respaldo
      sessionStorage.setItem('profesorId', profesorId);
      sessionStorage.setItem('asignaturaId', asignaturaId);
  
      const navigationExtras: NavigationExtras = {
        state: {
          profesorId: profesorId,
          asignaturaId: asignaturaId
        }
      };
      this.router.navigate(['/codigoprofe'], navigationExtras);
    } else {
      console.error('No se encontró el ID del profesor');
    }
  }

  al_vistaProfe() {
    if (this.profesorId) {
      const navigationExtras: NavigationExtras = {
        state: {
          profesorId: this.profesorId,
        },
      };
      this.router.navigate(['/vista-profe'], navigationExtras);
    } else {
      console.error('No se encontró el ID del profesor');
    }
  }
  

}
