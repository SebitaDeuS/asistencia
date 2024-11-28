import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FireBaseService } from 'src/app/services/fire-base.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NavigationExtras } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CrearAsignaturaComponent } from 'src/app/shared/components/crear-asignatura/crear-asignatura.component';
import { Network } from '@capacitor/network';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-vista-profe',
  templateUrl: './vista-profe.page.html',
  styleUrls: ['./vista-profe.page.scss'],
})
export class VistaProfePage implements OnInit {

  profesorId: string | null = null;
  asignaturas: any[] = []; 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firebaseService: FireBaseService,
    private modalController: ModalController,
    private utilsSvc: UtilsService
  ) {}

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {

      this.profesorId = navigation.extras.state['profesorId'];
      this.asignaturas = navigation.extras.state['asignaturas'];
    } else {

      this.profesorId = sessionStorage.getItem('profesorId');
      this.asignaturas = JSON.parse(sessionStorage.getItem('asignaturas') || '[]');
    }
    this.cargarAsignaturas();

    Network.addListener('networkStatusChange', async (status) => {
      if (status.connected) {
        console.log('Conexión restablecida. Intentando sincronizar asignaturas pendientes.');
        await this.sincronizarAsignaturasPendientes();
      }
    });

    const status = await Network.getStatus();
    if (status.connected) {
      await this.sincronizarAsignaturasPendientes();
    }

    console.log('Profesor ID en vista-profe:', this.profesorId);
    console.log('Asignaturas en vista-profe:', this.asignaturas);
  }

  al_codigo(asignaturaId: string, cursoId: string) {
    if (this.profesorId) {
        console.log('Navegando a codigoprofe con:', { profesorId: this.profesorId, asignaturaId, cursoId });
        
        sessionStorage.setItem('profesorId', this.profesorId);
        sessionStorage.setItem('asignaturaId', asignaturaId);
        sessionStorage.setItem('cursoId', cursoId);

        const navigationExtras: NavigationExtras = {
            state: {
                profesorId: this.profesorId,
                asignaturaId: asignaturaId,
                cursoId: cursoId,
            }
        };
        this.router.navigate(['/codigoprofe'], navigationExtras);
    } else {
        console.error('No se encontró el ID del profesor');
    }
}

cargarAsignaturas() {
  if (this.profesorId) {
    this.firebaseService.getAsignaturasProfesor(this.profesorId).subscribe((asignaturas) => {
      console.log('Asignaturas recuperadas:', asignaturas);

      this.asignaturas = asignaturas;
      sessionStorage.setItem('asignaturas', JSON.stringify(this.asignaturas));
    });
  } else {
    console.error('No se encontró el ID del profesor.');
  }
}

async sincronizarAsignaturasPendientes() {
    const status = await Network.getStatus();

    if (status.connected) {
      const asignaturasPendientes = JSON.parse(localStorage.getItem('asignaturasPendientes') || '[]');

      if (asignaturasPendientes.length > 0) {
        for (const asignatura of asignaturasPendientes) {
          await this.firebaseService.guardarAsignaturaEnFirebase(asignatura);
          this.utilsSvc.showToast(`Asignatura "${asignatura.nombre}" creada con éxito.`);
        }

        localStorage.removeItem('asignaturasPendientes');
        this.cargarAsignaturas();
      }
    } else {
  
      this.utilsSvc.showToast('Sin conexión a Internet. Las asignaturas pendientes se guardarán automáticamente cuando se restablezca la conexión.', 5000, 'warning');
    }
  }

  async crearAsignatura() {
    const modal = await this.modalController.create({
      component: CrearAsignaturaComponent,
      componentProps: { profesorId: this.profesorId },
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data && result.data.success) {
        console.log('Asignatura creada:', result.data.asignatura);

        const status = await Network.getStatus();

        if (status.connected) {
          // Si hay conexión, guarda directamente en Firebase
          await this.firebaseService.guardarAsignaturaEnFirebase(result.data.asignatura);
          this.utilsSvc.showToast(`Asignatura "${result.data.asignatura.nombre}" creada con éxito.`);
          this.cargarAsignaturas();
        } else {
          // Si no hay conexión, guarda en localStorage
          const asignaturasPendientes = JSON.parse(localStorage.getItem('asignaturasPendientes') || '[]');
          asignaturasPendientes.push(result.data.asignatura);
          localStorage.setItem('asignaturasPendientes', JSON.stringify(asignaturasPendientes));

          this.utilsSvc.showToast(`Sin conexión. Asignatura "${result.data.asignatura.nombre}" guardada localmente.`, 5000, 'warning');
        }
      }
    });

    return await modal.present();
  }
}

