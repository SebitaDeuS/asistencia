import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FireBaseService } from './../../services/fire-base.service';
@Component({
  selector: 'app-vista-olvide-contrasennia',
  templateUrl: './vista-olvide-contrasennia.page.html',
  styleUrls: ['./vista-olvide-contrasennia.page.scss'],
})
export class VistaOlvideContrasenniaPage implements OnInit {
  email: string = '';
  
  constructor(private auth: FireBaseService, 
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }


  async resetPassword() {
    try {
      await this.auth.resetPassword(this.email);
      const alert = await this.alertController.create({
        header: 'Correo enviado',
        message: 'Revisa tu correo para restablecer la contraseña.',
        buttons: ['OK'],
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ocurrió un error al intentar enviar el correo. Verifica el email.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }


  enviarRecuperacion() {
    console.log('Correo para recuperar contraseña:', this.email);
  }

  
}
