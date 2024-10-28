import { FireBaseService } from './../../services/fire-base.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioLog } from 'src/app/interfaces/i_usuario';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usr: UsuarioLog = {
    email: '',
    password: '',
  };

  hide: boolean = true;

  firebaseSvc = inject(FireBaseService);

  utilsSvc = inject(UtilsService)

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  showPassword() {
    this.hide = !this.hide; // Alternar entre mostrar y ocultar
  }

  async iniciar_sesion() {
    const user: User = {
      uid: '', 
      email: this.usr.email, 
      password: this.usr.password,
      name: '' 
    };
    
    await this.utilsSvc.showLoading(); // Mostrar el spinner de carga
    try {
      const result = await this.firebaseSvc.signIn(user);
      console.log('Usuario autenticado:', result.user);
      this.router.navigate(['/home']); // Navegar a la página de inicio
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Correo o contraseña incorrectos',
        buttons: ['OK'],
      });
      await alert.present();
    } finally {
      await this.utilsSvc.hideLoading(); // Ocultar el spinner después de la autenticación
    }
  }

  
  async alerta() {
    const alert = await this.alertController.create({
      header: 'Acceso denegado',
      subHeader: 'Usuario y/o contraseña incorrecta',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Aceptar',
          cssClass: 'btn-verde',
          handler: () => {
            console.log('Apreto aceptar desde controller');
          },
        },
      ],
    });

    await alert.present();
  }
}
