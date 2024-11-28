import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { UtilsService } from './utils.service';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private utilsSvc:UtilsService,
  ) {
    this.monitorNetwork();
  }

  monitorNetwork() {
    Network.addListener('networkStatusChange', async (status) => {
      console.log('Estado de red cambiado:', status.connected);
      if (status.connected) {
        await this.syncPendingUsers();
      }
    });
  }

  
  async isConnected(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  }

  async registerUser(email: string, password: string) {
    try {
      const isConnected = await this.isConnected();
      if (isConnected) {
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
        console.log('Usuario registrado en Firebase Auth:', userCredential.user);
        return userCredential;
      } else {
        console.log('Sin conexión: Guardando datos en local storage');
        const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
        pendingUsers.push({ email, password });
        localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));
        throw new Error('No hay conexión a Internet. Usuario guardado en local storage.');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  public async saveUserDataToFirestore(userId: string | undefined, email: string, password: string, nombre: string) {
    if (!userId) {
      console.log('Error: userId no definido');
      return;
    }
  
    const isConnected = await this.isConnected();
  
    if (isConnected) {
      const docRef = this.firestore.collection('Registro').doc('alumno');
      try {
        const docSnapshot = await docRef.get().toPromise();
        if (docSnapshot.exists) {
          await docRef.update({
            alumnos: firebase.firestore.FieldValue.arrayUnion({
              id_alumno: userId,
              correo_alumno: email,
              contraseña_alumno: password,
              nombre_alumno: nombre,
            }),
          });
        } else {
          await docRef.set({
            alumnos: [{
              id_alumno: userId,
              correo_alumno: email,
              contraseña_alumno: password,
              nombre_alumno: nombre,
            }],
          });
        }
        console.log('Usuario guardado en Firestore');
      } catch (error) {
        console.error('Error al guardar en Firestore:', error);
      }
    } else {
      console.log('Sin conexión: Guardando datos en local storage');
      const pendingFirestoreUsers = JSON.parse(localStorage.getItem('pendingFirestoreUsers') || '[]');
      pendingFirestoreUsers.push({ userId, email, password, nombre });
      localStorage.setItem('pendingFirestoreUsers', JSON.stringify(pendingFirestoreUsers));
    }
  }

  async syncPendingUsers() {
    const isConnected = await this.isConnected();
    if (!isConnected) {
      console.log('No hay conexión. Sincronización pendiente.');
      return;
    }
  
    // Sincronizar usuarios pendientes de autenticación
    const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    for (const user of pendingUsers) {
      try {
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
        console.log('Usuario sincronizado en Firebase Auth:', userCredential.user);
      } catch (error) {
        console.error('Error al sincronizar usuario con Firebase Auth:', error);
      }
    }
    localStorage.removeItem('pendingUsers');
  
    // Sincronizar usuarios pendientes de Firestore
    const pendingFirestoreUsers = JSON.parse(localStorage.getItem('pendingFirestoreUsers') || '[]');
    for (const user of pendingFirestoreUsers) {
      try {
        await this.saveUserDataToFirestore(user.userId, user.email, user.password, user.nombre);
        console.log('Usuario sincronizado en Firestore:', user);
      } catch (error) {
        console.error('Error al sincronizar usuario con Firestore:', error);
      }
    }
    localStorage.removeItem('pendingFirestoreUsers');
  }
}
