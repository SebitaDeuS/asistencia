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
    nombre_alumno:'',
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
      name: this.usr.nombre_alumno
    };
  
    await this.utilsSvc.showLoading();
    try {
      const result = await this.firebaseSvc.signIn(user);
      console.log('Usuario autenticado:', result.user);
  
      if (user.email.endsWith('@profesor.com')) {
        const profesorId = result.user?.uid;
        if (profesorId) {
          // Obtén las asignaturas del profesor
          this.firebaseSvc.getAsignaturasProfesor(profesorId)
              .pipe(take(1)) 
              .subscribe((asignaturas) => {
                console.log('Asignaturas del profesor:', asignaturas);
  
            // Guarda en sessionStorage como respaldo
            sessionStorage.setItem('profesorId', profesorId);
            sessionStorage.setItem('asignaturas', JSON.stringify(asignaturas));
  
            // Usa NavigationExtras para pasar los datos a vista-profe sin exponer en la URL
            const navigationExtras: NavigationExtras = {
              state: {
                profesorId: profesorId,
                asignaturas: asignaturas,
              }
            };
            this.router.navigate(['/vista-profe'], navigationExtras);
          });
        }
      } else {
        this.firebaseSvc.getAlumnoData(user.email).subscribe((studentData) => {
          console.log('correo alumno',user.email)
          console.log('Datos del estudiante:', studentData);
          console.log('Estructura de studentData:', JSON.stringify(studentData));
  
          // Pasar los datos a la página de inicio
          const navigationExtras: NavigationExtras = {
            state: {
              studentData: JSON.parse(JSON.stringify(studentData)) // Supone que hay un solo documento por correo de alumno
            }
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
          handler: () => {
            console.log('Apretó aceptar desde controller');
          },
        },
      ],
    });

    await alert.present();
  }
}