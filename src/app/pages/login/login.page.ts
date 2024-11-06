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
  
      // Verificar el dominio del correo electrónico
      if (user.email.endsWith('@profesor.com')) {
        // Obtener el ID del profesor desde el resultado de autenticación
        const profesorId = result.user?.uid;
        if (profesorId) {
          // Redirigir a la vista del profesor y pasar el ID como parámetro
          this.router.navigate(['/vista-profe'], { queryParams: { profesorId } });
        }
      } else {
        // Redirigir a la vista de alumno o a una página de inicio general
        this.router.navigate(['/home']);
      }
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
