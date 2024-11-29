import { Firestore, doc, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-vista-qr',
  templateUrl: './vista-qr.page.html',
  styleUrls: ['./vista-qr.page.scss'],
})
export class VistaQrPage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];
  studentData: any;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private alertController: AlertController,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
      this.showAlert('Escaneo de QR soportado: ' + this.isSupported);
    });
  
    const navigationState = history.state;
    if (navigationState && navigationState.student) {
      this.studentData = navigationState.student;
      this.showAlert('Datos del estudiante en Vista QR: ' + JSON.stringify(this.studentData));
    } else {
      this.showAlert('No se recibieron datos del estudiante en Vista QR');
    }
  
    // Escuchar cambios en el estado de la red
    Network.addListener('networkStatusChange', async (status) => {
  console.log('Estado de red cambiado:', status);
  if (status.connected) {
    this.showAlert('Conexión recuperada, sincronizando datos...');
    await this.syncOfflineData();
  } else {
    console.log('Sin conexión, esperando...');
  }
});
  
    // Verificar el estado inicial de la red
    Network.getStatus().then(async (status) => {
      console.log('Estado inicial de red:', status);
      if (status.connected) {
        this.showAlert('Conexión inicial detectada. Intentando sincronizar datos.');
        await this.syncOfflineData();
      }
    });
  }

  async scan(): Promise<void> {
    this.showAlert('Iniciando escaneo...');
  
    // Primero, guardamos los datos en localStorage para asegurar que se guarden
    this.saveOfflineData({
      profesorId: this.studentData.profesorId,
      asignaturaId: this.studentData.asignaturaId,
      fecha: this.studentData.fecha,
      cursoId: this.studentData.cursoId,
      alumnoData: {
        id_alumno: this.studentData.id_alumno,
        nombre_alumno: this.studentData.nombre_alumno,
        estado: true,
      },
    });
  
    const granted = await this.requestPermissions();
    this.showAlert('Permisos otorgados: ' + granted);
    if (!granted) {
      await this.presentAlert('Permisos denegados para la cámara');
      return;
    }
  
    const { barcodes } = await BarcodeScanner.scan();
    if (barcodes.length > 0) {
      const qrData = barcodes[0].displayValue;
      this.showAlert('Datos del QR: ' + qrData);
  
      const dataMap = qrData.split(' ').reduce((acc, pair) => {
        const [key, value] = pair.split('=');
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);
  
      const profesorId = dataMap['profesorId'];
      const asignaturaId = dataMap['asignaturaId'];
      const fecha = dataMap['fecha'];
      const cursoId = dataMap['cursoId'];
  
      await this.showQRDataAlert(dataMap);
  
      const alumnoData = {
        id_alumno: this.studentData.id_alumno,
        nombre_alumno: this.studentData.nombre_alumno,
        estado: true,
      };
  
      if (profesorId && asignaturaId && fecha && cursoId && this.studentData) {
        const claseRef = this.firestore.collection('cursos').doc(cursoId)
          .collection('secciones').doc(asignaturaId)
          .collection('Clases').doc(fecha);
  
        if (navigator.onLine) {  // Verificar si estamos en línea
          try {
            await claseRef.update({
              alumnos: arrayUnion(alumnoData),
            });
  
            await this.SuccesAlert();
            this.showAlert('Datos del alumno guardados en Firestore con estado presente.');
          } catch (error) {
            this.showAlert('Error al registrar al alumno en Firestore: ' + error);
            if (error.code === 'not-found') {
              await claseRef.set({ alumnos: [alumnoData] });
              this.showAlert('Documento creado y alumno registrado.');
            } else {
              await this.ErrorPresente('Error al registrar el alumno');
            }
          }
        } else {
          // Guardar los datos offline si estamos sin conexión
          this.showAlert('Sin conexión a la red, los datos se guardarán en localStorage.');
          this.saveOfflineData({
            profesorId,
            asignaturaId,
            fecha,
            cursoId,
            alumnoData,
          });
          await this.SuccesAlert();
        }
      } else {
        await this.ErrorPresente('Información incompleta en el QR o datos del alumno no disponibles');
        this.showAlert('Datos faltantes: ' + JSON.stringify({
          profesorId,
          asignaturaId,
          fecha,
          cursoId,
          studentData: this.studentData,
        }));
      }
    } else {
      this.showAlert('No se escaneó el QR.');
      await this.presentAlert('No se escaneó el QR.');
    }
  }
  
  

  // Sincronizar datos guardados cuando el usuario vuelve a estar en línea
  saveOfflineData(data: any) {
    let offlineData = JSON.parse(localStorage.getItem('offlineData') || '[]');
    offlineData.push(data);
    this.showAlert('Guardando datos en localStorage: ' + JSON.stringify(data));
    localStorage.setItem('offlineData', JSON.stringify(offlineData));
  }
  
  async retrySync(delay: number) {
    setTimeout(async () => {
      if (navigator.onLine) {
        this.showAlert('Reintentando sincronizar datos offline...');
        await this.syncOfflineData();
      } else {
        console.log('No hay conexión. Esperando reintentar...');
        this.retrySync(5000); // Reintentar después de 5 segundos
      }
    }, delay);
  }
  
  async syncOfflineData() {
    const offlineData = JSON.parse(localStorage.getItem('offlineData') || '[]');
    console.log('Datos recuperados de localStorage:', offlineData);
  
    if (offlineData.length === 0) {
      console.log('No hay datos para sincronizar.');
      return;
    }
  
    const remainingData = []; // Para los datos que no se sincronizaron correctamente
  
    for (const data of offlineData) {
      const claseRef = this.firestore.collection('cursos').doc(data.cursoId)
        .collection('secciones').doc(data.asignaturaId)
        .collection('Clases').doc(data.fecha);
  
      try {
        // Intentar sincronizar con Firestore
        await claseRef.update({
          alumnos: arrayUnion(data.alumnoData),
        });
        console.log('Datos sincronizados:', data);
      } catch (error) {
        console.error('Error al sincronizar:', error);
  
        // Intentamos manejar los errores de Firestore
        if (error.code === 'not-found') {
          try {
            await claseRef.set({ alumnos: [data.alumnoData] });
            console.log('Documento creado y datos sincronizados:', data);
          } catch (setError) {
            console.error('Error al crear documento:', setError);
            remainingData.push(data);
          }
        } else {
          remainingData.push(data);
        }
      }
    }
  
    // Actualizar `localStorage` solo con los datos pendientes
    if (remainingData.length > 0) {
      localStorage.setItem('offlineData', JSON.stringify(remainingData));
      console.log('Datos restantes no sincronizados:', remainingData);
    } else {
      localStorage.removeItem('offlineData');
      console.log('Todos los datos han sido sincronizados.');
    }
  }
  
  
  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async SuccesAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Asistencia registrada',
      message: 'Ya estás presente.',
      buttons: ['Entiendo'],
    });

    await alert.present();
  }

  async showQRDataAlert(data: Record<string, string>): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Datos del QR',
      message: `Profesor ID: ${data['profesorId']}<br>
                Asignatura ID: ${data['asignaturaId']}<br>
                Fecha: ${data['fecha']}<br>
                Curso ID: ${data['cursoId']}`,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async ErrorPresente(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['Entiendo'],
    });
    await alert.present();
  }

  // Alerta adicional para mensajes generales
  async presentAlert(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  // Función para mostrar alertas de depuración
  async showAlert(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Depuración',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  volver_al_home() {
    this.navCtrl.back();
  }
}
