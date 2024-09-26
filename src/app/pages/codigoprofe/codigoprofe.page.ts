import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-codigoprofe',
  templateUrl: './codigoprofe.page.html',
  styleUrls: ['./codigoprofe.page.scss'],
})
export class CodigoprofePage implements OnInit {

  constructor(private router:Router,
              private alertController:AlertController) { }

  ngOnInit() {
  }
al_vistaProfe(){
  this.router.navigate(["/vista-profe"])
}
al_codigo(){
  this.router.navigate(["/qrprofe"])
}
a_lista(){
  this.router.navigate(["/lista-pres"])
}
async alerta(){
  
 
  const alert = await this.alertController.create({
    header: 'Advertencia',
    message: 'Se Generara un Codigo, ¿Desea continuar?',
    backdropDismiss:false,
    buttons: [ 
      {
        text:'Cancelar',
        handler:()=>{
          this.router.navigate(["/codigoprofe"])
        }
        },
        {
      text: 'Continuar',
      handler: () => {
       
        this.router.navigate(['/qrprofe']);
      }
    }
    
      
    ,],
  });

  await alert.present();
}
}
