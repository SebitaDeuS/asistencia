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
  cursoId:string |null=null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.profesorId = navigation.extras.state['profesorId'];
      this.asignaturaId = navigation.extras.state['asignaturaId'];
      this.cursoId= navigation.extras.state['cursoId'];
    } else {
      this.profesorId = sessionStorage.getItem('profesorId');
      this.asignaturaId = sessionStorage.getItem('asignaturaId');
      this.cursoId= sessionStorage.getItem('cursoId');
    }

    if (this.profesorId && this.asignaturaId) {
      const fechaActual = new Date();
      const fechaFormateada = fechaActual.toLocaleDateString(); 
      const cursoId=this.cursoId;
      
      this.qrData = `profesorId=${this.profesorId} asignaturaId=${this.asignaturaId} fecha=${fechaFormateada} cursoId=${this.cursoId}`;
      console.log('Datos del QR:', this.qrData);
    } else {
      console.error('No se encontraron datos del profesor o asignatura en QRProfePage');
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
