import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Menulink } from './interfaces/menulink';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {

  //HACER PRONTO
  links:Menulink[]=[
    {   
      link:'/botones', 
      icono:'radio-button-on-outline',
      label:'botones'
    },
    {
      link:'/alertas',
      icono:'warning-outline',
      label:'alertas'
    },
    {
      link:'/formulario',
      icono:'reader-outline',
      label:'formulario'
    }
  ]
}

