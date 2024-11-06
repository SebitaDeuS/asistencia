import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, OnInit,inject } from '@angular/core';
import { UsuarioLog } from 'src/app/interfaces/i_usuario';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  usr: UsuarioLog = {
    email: '',
    password: '',
  };


  utilsSvc = inject(UtilsService)


  constructor(private afAuth:AngularFireAuth, private router:Router) { }
  ngOnInit(){
    
  }

  async registro() {

    
    if (!this.validarCorreo(this.usr.email)) {
      console.log('Error: El formato del correo electrónico es inválido');
      return;
    }
    
    await this.utilsSvc.showLoading();
    this.afAuth.createUserWithEmailAndPassword(this.usr.email, this.usr.password)
      .then((userCredential) => {
        console.log('Usuario registrado:', userCredential.user);
        this.router.navigate(['/login']);
        
      })
      .catch((error) => {
        console.log('Error al registrar el usuario:', error);
      });
      await this.utilsSvc.hideLoading();
  }
  
  validarCorreo(email: string): boolean {
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return formatoCorreo.test(email);
  }
}


