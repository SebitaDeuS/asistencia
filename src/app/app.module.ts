import { Compat } from './../../node_modules/@firebase/util/dist/node-esm/src/compat.d';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Menulink } from './interfaces/menulink';
import { Component } from '@angular/core';

// ******** FIRE BASE ********
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Si usas autenticación
import { environment } from '../environments/environment'; // Asegúrate de que la ruta sea correcta
import { QRCodeModule } from 'angularx-qrcode';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Firestore module

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ mode: 'md' }),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule, // Módulo de autenticación de Firebase
    QRCodeModule,  
    AngularFirestoreModule,
    
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
