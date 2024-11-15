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
    // Obtener los datos del alumno de la navegación
    const navigationState = history.state;
    if (navigationState && navigationState.student) {
      this.studentData = navigationState.student;
      console.log('Datos del estudiante en Vista QR:', this.studentData);
    } else {
      console.log('No se recibieron datos de estudiante en Vista QR');
    }
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
    console.log('Códigos escaneados:', barcodes);
    if (barcodes.length > 0) {
      // Decodificar el QR y extraer los datos
      const qrData = new URLSearchParams(barcodes[0].displayValue);
      console.log('Datos del QR:', qrData);
      const profesorId = qrData.get('profesorId');
      const asignaturaId = qrData.get('asignaturaId');
      const fecha = qrData.get('fecha');
      const hora = qrData.get('hora');
  
      // Verificar que todos los datos requeridos estén presentes
      if (profesorId && asignaturaId && fecha && this.studentData) {
        console.log('Datos completos, guardando en Firestore...');
        // Crear la referencia al documento de la clase específica utilizando la colección de Firestore
        const claseRef = this.firestore.collection('cursos').doc('PaG0r6gLTVMJ0WVtLGHo')
                                        .collection('secciones').doc(asignaturaId)
                                        .collection('Clases').doc(fecha);
  
        // Preparar los datos del alumno con estado `true`
        const alumnoData = {
          id_alumno: this.studentData.id_alumno,
          nombre_alumno: this.studentData.nombre_alumno,
          estado: true,  // Marcado como presente
          hora,
        };
  
        // Actualizar el array de alumnos en la clase correspondiente
        await claseRef.update({
          alumnos: arrayUnion(alumnoData)
        });
  
        console.log('Datos del alumno guardados en Firestore con estado presente.');
      } else {
        console.error('Información incompleta en el QR o datos del alumno no disponibles');
      }
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permiso denegado',
      message: 'Para usar la aplicación autorizar los permisos de cámara',
      buttons: ['OK'],
    });
    await alert.present();
  }

  volver_al_home() {
    this.navCtrl.back();
  }

}
