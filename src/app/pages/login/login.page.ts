import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioLog } from 'src/app/interfaces/i_usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usr:UsuarioLog={
  username:'',
  password:''
  }

  constructor(private router:Router, private alertController:AlertController) { }
  
  
  ngOnInit() {
  }

  iniciar_sesion(){
    console.log("Iniciar sesion");
    if(this.usr.username=="seba" && this.usr.password=="123"){
      this.router.navigate(["/home"]);
    }
    else{
      this.alerta();
    }
  }


  async alerta(){

    const alert = await this.alertController.create({
      header: 'Acceso denegado',
      subHeader: 'Usuario y/o contraseña incorrecta',
      backdropDismiss:false,
      buttons: [ {
        text:"Aceptar",
        cssClass:'btn-verde',
        handler:()=>{
          console.log("Apreto aceptar desde controller");
        }
      },],
    });

    await alert.present();
  }


}
