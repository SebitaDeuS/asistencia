import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private utilsSvc:UtilsService,
  ) {}

  async registerUser(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      console.log('Se guarda en auth')
      console.log('se guarda en firestore?')
      return userCredential;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }finally{
      await this.utilsSvc.hideLoading();
    }
  }

  public async saveUserDataToFirestore(userId: string | undefined, email: string, password: string,nombre:string) {
    if (userId) {
      const docRef = this.firestore
        .collection('Registro')  
        .doc('alumno');
      try {
        await this.utilsSvc.showLoading();
        const docSnapshot = await docRef.get().toPromise();
        if (docSnapshot.exists) {
         
          await docRef.update({
            alumnos: firebase.firestore.FieldValue.arrayUnion({
              id_alumno: userId,
              correo_alumno: email,
              contraseña_alumno: password,
              nombre_alumno:nombre,
            })
          });
        } else {
          await docRef.set({
            alumnos: [{
              id_alumno: userId,
              correo_alumno: email,
              contraseña_alumno: password,
              nombre_alumno:nombre,
            }]
          });
        }
        console.log('Usuario guardado en Firestore');
      } catch (error) {
        console.error('Error al guardar en Firestore:', error);
      }finally{
        await this.utilsSvc.hideLoading();
      }
    } else {
      console.log('Error al guardar en Firestore: userId no definido');
    }
  }
}
