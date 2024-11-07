import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) {}

  async registerUser(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      console.log('Se guarda en auth')
      // await this.saveUserDataToFirestore(userCredential.user?.uid, email, password);
      console.log('se guarda en firestore?')
      return userCredential;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  public async saveUserDataToFirestore(userId: string | undefined, email: string, password: string) {
    if (userId) {
      const docRef = this.firestore
        .collection('cursos')  // Cambia si "cursos" es el nombre correcto de la colección principal
        .doc('FnU6lE1vSejqvw90bKUd') // ID del documento del curso específico
        .collection('secciones')  // Subcolección "secciones"
        .doc('001');// Documento específico de la sección
        
      // Actualizamos el campo "alumnos" usando arrayUnion para agregar un nuevo objeto alumno.
      try {
        const docSnapshot = await docRef.get().toPromise();
        if (docSnapshot.exists) {
          // Si el documento existe, usa update para agregar el alumno
          await docRef.update({
            alumnos: firebase.firestore.FieldValue.arrayUnion({
              id_alumno: userId,
              correo_alumno: email,
              contraseña_alumno: password
            })
          });
        } else {
          // Si el documento no existe, usa set para crear el documento con el array de alumnos
          await docRef.set({
            alumnos: [{
              id_alumno: userId,
              correo_alumno: email,
              contraseña_alumno: password
            }]
          });
        }
        console.log('Usuario guardado en Firestore');
      } catch (error) {
        console.error('Error al guardar en Firestore:', error);
      }
    } else {
      console.log('Error al guardar en Firestore: userId no definido');
    }
  }
}
