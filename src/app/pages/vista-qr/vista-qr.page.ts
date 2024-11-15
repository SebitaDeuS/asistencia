import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-vista-qr',
  templateUrl: './vista-qr.page.html',
  styleUrls: ['./vista-qr.page.scss'],
})
export class VistaQrPage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];
  studentData: any;

  constructor(private router: Router,
    private navCtrl: NavController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    //============Para la scan===========
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
     //============Para la scan===========

    // Obtener los datos del alumno de la navegación
    const navigationState = history.state;
    if (navigationState && navigationState.student) {
      this.studentData = navigationState.student;
      console.log('Datos del estudiante en Vista QR:', this.studentData);
    } else {
      console.log('No se recibieron datos de estudiante en Vista QR');
    }
  }

  volver_al_home(){
    this.navCtrl.back();
  }
  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);
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
}
