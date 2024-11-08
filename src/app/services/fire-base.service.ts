import { Injectable , inject} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';  // Necesario para un almacenamiento reactivo

import { mergeMap, combineLatest, map, concatMap, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class FireBaseService {


  private asignaturaIdSubject = new BehaviorSubject<string | null>(null);  // Esto guardará la ID de la asignatura
  asignaturaId$ = this.asignaturaIdSubject.asObservable();  // Un observable para observar los cambios en la ID

  auth = inject(AngularFireAuth); 
  firestore = inject(AngularFirestore);

 
  /* ########### Autenticacion ###########*/

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }


  // Método para obtener el ID del usuario autenticado
  getProfesorId(): Observable<string | null> {
    return this.auth.authState.pipe(map(user => user ? user.uid : null));
  }



  getAsignaturasProfesor(idProfesor: string): Observable<any[]> {
    return this.firestore.collection('cursos').snapshotChanges().pipe(
      concatMap(cursos => {
        console.log('Cursos obtenidos:', cursos); // Verificar que se obtengan cursos
        return combineLatest(
          cursos.map(curso => {
            const cursoData = curso.payload.doc.data() as { nombre: string };
            const cursoId = curso.payload.doc.id;
            console.log(`Curso ID: ${cursoId}, Nombre: ${cursoData.nombre}`); // Mostrar info del curso

            return this.firestore.collection(`cursos/${cursoId}/secciones`, ref =>
              ref.where('profesor.id_profesor', '==', idProfesor)
            ).snapshotChanges().pipe(
              map(secciones => {
                const seccionesList = secciones.map(seccion => ({
                  id: seccion.payload.doc.id,
                  nombre: cursoData.nombre, // Nombre del curso
                  ...(seccion.payload.doc.data() as object) // Datos de la sección
                }));
                console.log(`Secciones para el curso ${cursoData.nombre}:`, seccionesList); // Log de secciones
                return seccionesList;
              })
            );
          })
        );
      }),
      map(cursos => cursos.reduce((acc, val) => acc.concat(val), [])) // Aplanar array
    );
  }

  // Método para establecer la ID de la asignatura
  setAsignaturaId(id: string) {
    this.asignaturaIdSubject.next(id);
  }


  resetPassword(email: string): Promise<void> {
    return this.auth.sendPasswordResetEmail(email);
  }

  // Método para obtener la ID de la asignatura
  getAsignaturaId(): string | null {
    return this.asignaturaIdSubject.value;
  }

  // Limpiar la ID de la asignatura
  clearAsignaturaId() {
    this.asignaturaIdSubject.next(null);
  }
}
