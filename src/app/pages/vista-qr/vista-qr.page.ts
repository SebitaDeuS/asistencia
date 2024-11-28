import { Firestore, doc, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
    private firestore:AngularFirestore
  ) { }

  ngOnInit() {
    //======para el scanear=====
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
      //para el escanaer===========

    });
    
    const navigationState = history.state;
    if (navigationState && navigationState.student) {
      this.studentData = navigationState.student;
      console.log('Datos del estudiante en Vista QR:', this.studentData);
    } else {
      console.log('No se recibieron datos de estudiante en Vista QR');
    }
  }

  async ErrorPresente(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['Entiendo']
    });
    await alert.present();
  }

  async SuccesAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Asistencia registrada',
      message: 'Ya estas Presente',
      buttons: ['Entiendo'],
    });

    await alert.present();
  }

  async alerta(messege:string){
    const alert =await this.alertController.create({
      header:'Aviso',
      message:messege,
      buttons:['Entiendo']
    });
    await alert.present()
  }
  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permiso denegado',
      message: 'Para usar la aplicación, autoriza los permisos de cámara.',
      buttons: ['OK'],
    });
  
    await alert.present();
  }
  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }
  async scan(): Promise<void> {
    console.log('Iniciando escaneo...');
    const granted = await this.requestPermissions();
    console.log('Permisos otorgados:', granted);
    if (!granted) {
      this.presentAlert();
      return;
    }
  
    const { barcodes } = await BarcodeScanner.scan();
  if (barcodes.length > 0) {
    const qrData = barcodes[0].displayValue; 
    console.log('Datos del QR:', qrData);

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

    if (profesorId && asignaturaId && fecha && cursoId && this.studentData) {
      const claseRef = this.firestore.collection('cursos').doc(cursoId)
                                     .collection('secciones').doc(asignaturaId)
                                     .collection('Clases').doc(fecha);

      const alumnoData = {
        id_alumno: this.studentData.id_alumno,
        nombre_alumno: this.studentData.nombre_alumno,
        estado: true,
      };

      try {
        await claseRef.update({
          alumnos: arrayUnion(alumnoData),
        });

        await this.SuccesAlert();
        console.log('Datos del alumno guardados en Firestore con estado presente.');
      } catch (error) {
        console.error('Error al registrar al alumno en Firestore:', error);
        if (error.code === 'not-found') {
          await claseRef.set({ alumnos: [alumnoData] });
          console.log('Documento creado y alumno registrado.');
        } else {
          await this.ErrorPresente('Error al registrar el alumno');
        }
      }
    } else {
      await this.ErrorPresente('Información incompleta en el QR o datos del alumno no disponibles');
      console.error('Datos faltantes:', {
        profesorId,
        asignaturaId,
        fecha,
        cursoId,
        studentData: this.studentData,
      });
    }
  } else {
    console.log('No se escanearon códigos.');
  }
}

// Método adicional para mostrar los datos procesados en una alerta
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
async showQRdato(data: Record<string, string>): Promise<void> {
  const alert = await this.alertController.create({
    header: 'Datos del QR',
    message: `Profesor ID: ${data['profesorId']}<br>
              Asignatura ID: ${data['asignaturaId']}<br>
              Fecha: ${data['fecha']}<br>
              Curso ID: ${data['cursoid']}`,
    buttons: ['OK'],
  });

  await alert.present();
}

  volver_al_home() {
    this.navCtrl.back();
  }

}
