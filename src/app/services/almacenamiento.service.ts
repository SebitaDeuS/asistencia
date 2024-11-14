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
  obtenerDatos() {
    return this.firestore.collection('miColeccion').valueChanges();
  }
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

  public async saveUserDataToFirestore(userId: string | undefined, email: string, contraseña: string) {
    if (userId) {
      const docRef = this.firestore
        .collection('cursos')  
        .doc('Registro');
       
        
      try {
        await this.utilsSvc.showLoading();
        const docSnapshot = await docRef.get().toPromise();
        if (docSnapshot.exists) {
         
          await docRef.update({
            alumnos: firebase.firestore.FieldValue.arrayUnion({
              id_alumno: userId,
              correo_alumno: email,
              password: contraseña
            })
          });
        } else {
          await docRef.set({
            alumnos: [{
              id_alumno: userId,
              correo_alumno: email,
              password: contraseña
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

  //inicio el guardar datos escaneados
//   async guardarDatosEscaneados(profesorId: string, asignaturaId: string, fecha: string, hora: string) {
//     try {
//       const docRef = this.firestore.collection('cursos').doc('FnU6lE1vSejqvw90bKUd').collection('secciones').doc(asignaturaId);
//       const docSnapshot = await docRef.ref.get(); // Usando ref.get()
//       if (!docSnapshot.exists) {
//         throw new Error('Sección no encontrada');
//       }
      
//       const seccionData = docSnapshot.data();
      
//       // Verificar que el ID del profesor coincida
//       if (seccionData['profesor'].id_profesor === profesorId) {
//         await docRef.update({
//           alumnos: firebase.firestore.FieldValue.arrayUnion({
//             id_profesor: profesorId,
//             constrase: email,
//             contraseña_alumno: password
//           })
//         });
        
//         console.log('Datos actualizados correctamente');
//       } else {
//         throw new Error('El ID del profesor no coincide');
//       }
//     } catch (error) {
//       console.error('Error al guardar datos escaneados:', error);
//     }
//   }

}