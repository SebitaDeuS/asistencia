import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { Firestore, doc, updateDoc, getDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/almacenamiento.service';
import { FireBaseService } from 'src/app/services/fire-base.service';
@Component({
  selector: 'app-vista-qr',
  templateUrl: './vista-qr.page.html',
  styleUrls: ['./vista-qr.page.scss'],
})
export class VistaQrPage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];
  mensajeEstado: string = ''; // Variable para el mensaje de estado
  mensajeError: boolean = false; // Variable para indicar si es un mensaje de error


  constructor(
    private alertcontroller: AlertController,
    private authService: AuthService,
    private firebaseService: FireBaseService
  ) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
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
    const alert = await this.alertcontroller.create({
      header: 'Permiso denegado',
      message: 'Permiso de cámara requerido',
      buttons: ['OK'],
    });
    await alert.present();
  }
  //fin de abrir escanear

}
    