import { AlertController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FireBaseService } from 'src/app/services/fire-base.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-codigoprofe',
  templateUrl: './codigoprofe.page.html',
  styleUrls: ['./codigoprofe.page.scss'],
})
export class CodigoprofePage implements OnInit {
  asignaturaId: string | null = null;
  profesorId: string | null = null;
  qrData: string = '';



  constructor(private router: Router,
              private alertController: AlertController,
              private route: ActivatedRoute,
              private navCtrl: NavController  
            ) { }

            ngOnInit() {
              const navigation = this.router.getCurrentNavigation();
              if (navigation && navigation.extras.state) {
                this.profesorId = navigation.extras.state['profesorId'];
                this.asignaturaId = navigation.extras.state['asignaturaId'];
              } else {
                // Obtener datos de sessionStorage si state no está disponible
                this.profesorId = sessionStorage.getItem('profesorId');
                this.asignaturaId = sessionStorage.getItem('asignaturaId');
              }
          
              console.log('Valores obtenidos en CodigoprofePage:', {
                profesorId: this.profesorId,
                asignaturaId: this.asignaturaId
              });
          
              if (this.profesorId && this.asignaturaId) {
                console.log('Profesor ID:', this.profesorId);
                console.log('Asignatura ID:', this.asignaturaId);
              } else {
                console.error('No se encontraron datos del profesor o asignatura.');
              }
            }
            


  generarQR() {
    if (this.profesorId && this.asignaturaId) {
      const fechaActual = new Date();
      const fechaFormateada = fechaActual.toLocaleDateString(); 
      const horaFormateada = fechaActual.toLocaleTimeString(); 
      
      this.qrData = `profesorId=${this.profesorId}&asignaturaId=${this.asignaturaId}&fecha=${fechaFormateada}&hora=${horaFormateada}`;
      
      const navigationExtras: NavigationExtras = {
        state: {
          profesorId: this.profesorId,
          asignaturaId: this.asignaturaId,
          qrData: this.qrData // Pasar los datos del QR
        },
      };
      this.router.navigate(['/qrprofe'], navigationExtras);
    } else {
      console.error('No se encontraron datos del profesor o asignatura para generar el QR');
    }
  }
  al_vistaProfe() {
    const navigationExtras: NavigationExtras = {
      state: {
        profesorId: this.profesorId
      }
    };
    this.router.navigate(['/vista-profe'], navigationExtras);
  }

  al_codigo() {
    this.router.navigate(["/qrprofe"]);
  }

  a_lista() {
    this.router.navigate(["/lista-pres"]);
  }

  async alerta() {
    const alert = await this.alertController.create({
      header: 'Advertencia',
      message: 'Se Generará un Código, ¿Desea continuar?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            this.router.navigate(['/codigoprofe']);
          },
        },
        {
          text: 'Continuar',
          handler: () => {
            const navigationExtras: NavigationExtras = {
              state: {
                profesorId: this.profesorId,
                asignaturaId: this.asignaturaId,
              },
            };
            this.router.navigate(['/qrprofe'], navigationExtras);
          },
        },
      ],
    });

    await alert.present();
  }
}

