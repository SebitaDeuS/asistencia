import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vista-olvide-contrasennia',
  templateUrl: './vista-olvide-contrasennia.page.html',
  styleUrls: ['./vista-olvide-contrasennia.page.scss'],
})
export class VistaOlvideContrasenniaPage implements OnInit {
  correo: string = '';
  
  constructor() { }

  ngOnInit() {
  }



  enviarRecuperacion() {
    // Lógica para enviar el correo de recuperación
    console.log('Correo para recuperar contraseña:', this.correo);
    // Aquí podrías implementar la lógica para enviar el correo de recuperación
  }

  
}
