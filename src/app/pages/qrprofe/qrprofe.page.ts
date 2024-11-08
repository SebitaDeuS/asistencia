import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    // Obtener parámetros de la URL
    this.route.queryParamMap.subscribe(params => {
      this.asignaturaId = params.get('asignaturaId');
      this.profesorId = params.get('profesorId');

      // Si ambos parámetros están disponibles, crea el string para el QR
      if (this.asignaturaId && this.profesorId) {
        this.qrData = `asignaturaId=${this.asignaturaId}&profesorId=${this.profesorId}`;
        console.log('QR Data:', this.qrData);  
      }
    });
  }

  al_vistaProfe() {
    const profesorId = this.route.snapshot.queryParamMap.get('profesorId');
    if (profesorId) {
      this.router.navigate(['/vista-profe'], { queryParams: { profesorId } });
    } else {
      console.error('No se encontró el ID del profesor');
    }
  }

}
