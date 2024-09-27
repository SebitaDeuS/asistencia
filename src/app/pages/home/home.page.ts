import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router) {}
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
