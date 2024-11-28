import { Component, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-crear-asignatura',
  templateUrl: './crear-asignatura.component.html',
  styleUrls: ['./crear-asignatura.component.scss'],
})
export class CrearAsignaturaComponent {
  @Input() profesorId: string | null = null;

  nombreAsignatura: string = '';
  nombreSeccion: string = '';

  constructor(
    private modalCtrl: ModalController,
    private firestore: AngularFirestore,
    private toastCtrl: ToastController
  ) {}

  cerrarModal(data: any = null) {
    this.modalCtrl.dismiss(data);
  }

  async crearAsignatura() {
    if (!this.nombreAsignatura.trim() || !this.nombreSeccion.trim()) {
      console.error('El nombre de la asignatura o de la sección no puede estar vacío.');
      return;
    }

    const asignatura = {
      cursoId: this.firestore.createId(),
      nombre: this.nombreAsignatura,
      seccionId: this.nombreSeccion,
      profesorId: this.profesorId,
      profesorNombre: 'Nombre del Profesor', // Reemplazar con el nombre real si está disponible
    };

    try {
      const status = await Network.getStatus();

      if (status.connected) {
        // Si hay conexión, guardar directamente en Firebase
        const cursoRef = this.firestore.collection('cursos').doc(asignatura.cursoId);
        await cursoRef.set({ nombre: asignatura.nombre });

        const seccionRef = cursoRef.collection('secciones').doc(asignatura.seccionId);
        await seccionRef.set({
          profesor: {
            id_profesor: asignatura.profesorId,
            nombre_profesor: asignatura.profesorNombre,
          },
          alumnos: [],
        });

        const clasesRef = seccionRef.collection('Clases').doc('plantilla');
        await clasesRef.set({ alumnos: [] });

        console.log('Asignatura guardada en Firebase.');
        await this.mostrarToast(`Asignatura "${asignatura.nombre}" creada con éxito.`);
      } else {
        // Si no hay conexión, guardar en localStorage
        const asignaturasPendientes =
          JSON.parse(localStorage.getItem('asignaturasPendientes') || '[]') || [];
        asignaturasPendientes.push(asignatura);
        localStorage.setItem('asignaturasPendientes', JSON.stringify(asignaturasPendientes));

        console.log('Asignatura guardada localmente.');
        await this.mostrarToast(
          `Sin conexión. La asignatura "${asignatura.nombre}" se guardará cuando vuelvas a estar en línea.`
        );
      }

      // Cerrar el modal independientemente de la conexión
      this.cerrarModal({ success: true, asignatura });
    } catch (error) {
      console.error('Error al crear asignatura:', error);
      await this.mostrarToast('Error al crear la asignatura. Inténtalo de nuevo.');
    }
  }

  private async mostrarToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }
}