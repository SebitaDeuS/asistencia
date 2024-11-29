import { FireBaseService } from './../../services/fire-base.service';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { take } from 'rxjs';
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
    nombre_alumno: '',
  };

  hide: boolean = true;

  firebaseSvc = inject(FireBaseService);

  utilsSvc = inject(UtilsService);

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  showPassword() {
    this.hide = !this.hide;
  }

  async iniciar_sesion() {
    const user: User = {
      uid: '',
      email: this.usr.email,
      password: this.usr.password,
      name: this.usr.nombre_alumno,
    };

    await this.utilsSvc.showLoading();
    try {
      const result = await this.firebaseSvc.signIn(user);

      if (user.email.endsWith('@profesor.com')) {
        const profesorId = result.user?.uid;
        if (profesorId) {
          this.firebaseSvc
            .getAsignaturasProfesor(profesorId)
            .pipe(take(1))
            .subscribe((asignaturas) => {
              sessionStorage.setItem('profesorId', profesorId);
              sessionStorage.setItem('asignaturas',JSON.stringify(asignaturas)
              );
              const navigationExtras: NavigationExtras = {
                state: {
                  profesorId: profesorId,
                  asignaturas: asignaturas,
                },
              };
              this.router.navigate(['/vista-profe'], navigationExtras);
            });
        }
      } else {
        this.firebaseSvc.getAlumnoData(user.email).subscribe((studentData) => {
          const navigationExtras: NavigationExtras = {
            state: {
              studentData: JSON.parse(JSON.stringify(studentData)),
            },
          };
          this.router.navigate(['/home'], navigationExtras);
        });
      }
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Correo o contraseña incorrectos',
        buttons: ['OK'],
      });
      await alert.present();
    } finally {
      await this.utilsSvc.hideLoading();
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
          handler: () => {},
        },
      ],
    });

    await alert.present();
  }
}
