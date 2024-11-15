import { AlertController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FireBaseService } from 'src/app/services/fire-base.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { concatMap, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-codigoprofe',
  templateUrl: './codigoprofe.page.html',
  styleUrls: ['./codigoprofe.page.scss'],
})
export class CodigoprofePage implements OnInit {
  asignaturaId: string | null = null;
  profesorId: string | null = null;
  qrData: string = '';
  seccionId: string = '';
  cursoId: string | null = null; 



  constructor(private router: Router,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private firebase: AngularFirestore,
    private firebsv: FireBaseService,

  ) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
        this.profesorId = navigation.extras.state['profesorId'];
        this.asignaturaId = navigation.extras.state['asignaturaId'];
        this.cursoId = navigation.extras.state['cursoId'];  // Recibimos cursoId
    } else {
        this.profesorId = sessionStorage.getItem('profesorId');
        this.asignaturaId = sessionStorage.getItem('asignaturaId');
        this.cursoId = sessionStorage.getItem('cursoId');
    }

    console.log('Datos en codigoprofe:', {
        profesorId: this.profesorId,
        asignaturaId: this.asignaturaId,
        cursoId: this.cursoId
    });

    if (!this.cursoId) {
        console.error('No se encontró el ID del curso.');
    }
}



  generarQR() {
    if (this.profesorId && this.asignaturaId && this.cursoId) {
        const fechaActual = new Date();
        const fechaFormateada = fechaActual.toLocaleDateString();

        this.qrData = `profesorId=${this.profesorId}&asignaturaId=${this.asignaturaId}&fecha=${fechaFormateada}`;

        const navigationExtras: NavigationExtras = {
            state: {
                profesorId: this.profesorId,
                asignaturaId: this.asignaturaId,
                qrData: this.qrData
            }
        };
        this.router.navigate(['/qrprofe'], navigationExtras);

        this.firebsv.updateFechaClase(this.cursoId, this.asignaturaId, this.asignaturaId, fechaFormateada)
            .then(() => {
                console.log('Clase guardada con éxito');
            })
            .catch(error => {
                console.error('Error al guardar la clase:', error);
            });
    } else {
        console.error('Datos incompletos para generar QR:', {
            profesorId: this.profesorId,
            asignaturaId: this.asignaturaId,
            cursoId: this.cursoId
        });
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

