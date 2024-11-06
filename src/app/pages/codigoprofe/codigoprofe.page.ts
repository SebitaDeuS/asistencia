import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
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


  constructor(private router: Router,
              private alertController: AlertController,
              private route: ActivatedRoute,
              private navCtrl: NavController  // Agrega esto
            ) { }

  ngOnInit() {
    // Usamos queryParamMap para obtener los parámetros correctos de la URL
    this.route.queryParamMap.subscribe(params => {
      this.asignaturaId = params.get('asignaturaId');
      this.profesorId = params.get('profesorId');
      
      console.log('ID de la asignatura:', this.asignaturaId);
      console.log('ID del profesor:', this.profesorId);

      // Si no se encontró el profesorId, muestra un error
      if (!this.profesorId) {
        console.error('No se encontró el ID del profesor');
      }
    });
  }

  al_vistaProfe() {
    const profesorId = this.route.snapshot.queryParamMap.get('profesorId');
    if (profesorId) {
      this.router.navigate(['/vista-profe'], { queryParams: { profesorId } });
    } else {
      console.error('No se encontró el ID del profesor');
    }
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
      message: 'Se Generara un Codigo, ¿Desea continuar?',
      backdropDismiss: false,
      buttons: [ 
        {
          text: 'Cancelar',
          handler: () => {
            this.router.navigate(["/codigoprofe"]);
          }
        },
        {
          text: 'Continuar',
          handler: () => {
            this.router.navigate(['/qrprofe']);
          }
        }
      ],
    });

    await alert.present();
  }
}
