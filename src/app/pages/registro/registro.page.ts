import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, OnInit,inject } from '@angular/core';
import { UsuarioLog } from 'src/app/interfaces/i_usuario';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/almacenamiento.service';
import { Network } from '@capacitor/network';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  usr: UsuarioLog = {
    email: '',
    password: '',
    nombre_alumno:'',
  };


  utilsSvc = inject(UtilsService)


  constructor(
    private afAuth:AngularFireAuth,
     private router:Router, 
     private authService: AuthService,
     private toastController: ToastController)   { }

  ngOnInit(){
    
  }

  async registro() {
    if (!this.validarCorreo(this.usr.email)) {
      console.log('Error: El formato del correo electrónico es inválido');
      return;
    }

    await this.utilsSvc.showLoading();

    try {
      const isConnected = await this.checkConnection();

      if (isConnected) {
        // Registro normal con conexión a Internet
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(
          this.usr.email,
          this.usr.password
        );

        console.log('Usuario registrado:', userCredential.user);
        if (userCredential.user) {
          await this.authService.saveUserDataToFirestore(
            userCredential.user.uid,
            this.usr.email,
            this.usr.password,
            this.usr.nombre_alumno
          );
        }
        this.router.navigate(['/login']);
      } else {
        // Sin conexión: guardar usuario en localStorage
        console.log('Sin conexión: Guardando usuario en localStorage');
        const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
        pendingUsers.push({
          email: this.usr.email,
          password: this.usr.password,
          nombre_alumno: this.usr.nombre_alumno,
        });
        localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));
        console.log('Usuario guardado en localStorage para sincronización futura');
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        // Muestra un Toast si el correo ya está en uso
        this.showToast('El correo ya está registrado. Intenta con otro.', 'danger');
      } else {
        console.error('Error durante el registro:', error);
        this.showToast('Error al registrar el usuario. Intenta nuevamente.', 'danger');
      }
    } finally {
      await this.utilsSvc.hideLoading();
    }
  }

  validarCorreo(email: string): boolean {
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return formatoCorreo.test(email);
  }

  // Método para verificar la conexión a Internet
  private async checkConnection(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000, // Duración en milisegundos
      color, // Color del Toast (puede ser 'primary', 'success', 'danger', etc.)
      position: 'top', // Posición del Toast ('top', 'middle', 'bottom')
    });
    await toast.present();
  }
  
}


