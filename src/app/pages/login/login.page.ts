import { FireBaseService } from './../../services/fire-base.service';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
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
    private alertController: AlertController,
  ) { }

  ngOnInit() { }

  showPassword() {
    this.hide = !this.hide; // Alternar entre mostrar y ocultar
  }

  async iniciar_sesion() {
    await this.utilsSvc.showLoading();
    const user: User = {
      uid: '',
      email: this.usr.email,
      password: this.usr.password,
      name: ''
    };


    try {
      const result = await this.firebaseSvc.signIn(user);
      console.log('Usuario autenticado:', result.user);

      if (user.email.endsWith('@profesor.com')) {
        const profesorId = result.user?.uid;
        if (profesorId) {
          // Obtén las asignaturas del profesor
          this.firebaseSvc.getAsignaturasProfesor(profesorId).subscribe((asignaturas) => {
            console.log('Asignaturas del profesor:', asignaturas);

            // Guarda en sessionStorage como respaldo
            sessionStorage.setItem('profesorId', profesorId);
            sessionStorage.setItem('asignaturas', JSON.stringify(asignaturas));

            // Usa NavigationExtras para pasar los datos a vista-profe sin exponer en la URL
            const navigationExtras: NavigationExtras = {
              state: {
                profesorId: profesorId,
                asignaturas: JSON.parse(JSON.stringify(asignaturas)), // Clonar datos serializables
              }
            };
            this.router.navigate(['/vista-profe'], navigationExtras);
            console.log('se inicio sesion como profesor')
          });
        }
      } else {
        console.log('iniciar alumno')
        //sesion para el alumno
          const id_alumno = result.user?.uid;
          if (id_alumno) {
            console.log('Pasando a alumno',id_alumno)
            this.firebaseSvc.getAlumnoData(id_alumno).subscribe((Registro) => {
              console.log('registro',Registro)
              console.log('Datos del alumno (QuerySnapshot):', Registro.docs);

              const alumnoData = Registro.docs.map((doc) => doc.data());
              console.log('Datos del alumno (JSON):', alumnoData);

              sessionStorage.setItem('id_alumno', id_alumno);
              sessionStorage.setItem('alumnoData', JSON.stringify(Registro));

              // Usa NavigationExtras para pasar los datos a Home sin exponer en la URL

              const navigationExtras: NavigationExtras = {
                state: {
                  id_alumno: id_alumno,
                  alumnoData: JSON.parse(JSON.stringify(Registro)), // Clonar datos serializables
                }
                
              };
              console.log('ruta',navigationExtras)
              this.router.navigate(['/home'], navigationExtras);
            });
          } else {
            console.error('No se pudo obtener el ID del alumno.');
          }

        
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