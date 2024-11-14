import { Injectable , inject} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { User } from '../models/user.model';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject,Observable,} from 'rxjs';  // Necesario para un almacenamiento reactivo
import { mergeMap, combineLatest, map, concatMap, of } from 'rxjs';
import { Curso } from 'src/app/interfaces/i_usuario'; 
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
  getAlumnoData(id_alumno: string): Observable<any> {
    return this.firestore
      .collection('cursos')
      .doc('Registro')
      .collection('alumnos', ref => ref.where('id_alumno', '==', id_alumno)) // Filtra los documentos por id_alumno
      .get()
  }
  getCorreoAlumno(id_alumno: string): Observable<string> {
    return this.firestore.collection('cursos', ref => ref.where('alumnos', 'array-contains', { id_alumno: id_alumno }))
      .get()
      .pipe(
        map(snapshot => {
          let correo = 'Correo no disponible';
          snapshot.forEach(doc => {
            const data = doc.data() as Curso; // Obtener los datos correctamente usando `.data()`
            const alumno = data.alumnos.find(al => al.id_alumno === id_alumno);
            if (alumno) {
              correo = alumno.correo_alumno;
            }
          });
          return correo;
        }),
        catchError(error => {
          console.error("Error obteniendo correo del alumno:", error);
          return of('Correo no disponible');
        })
      );
  }
  async getCurrentUser(): Promise<string | null> {
    const user = await this.auth.currentUser; // Usar Firebase Authentication
    return user ? user.uid : null;  // Retorna el UID si está autenticado, o null si no lo está
  }


  getAsignaturasProfesor(idProfesor: string): Observable<any[]> {
    return this.firestore.collection('cursos').snapshotChanges().pipe(
      concatMap(cursos => {
        // Filtra solo los cursos con nombre definido
        const cursosFiltrados = cursos.filter(curso => {
          const cursoData = curso.payload.doc.data() as { nombre?: string };
          return cursoData.nombre; // Solo pasa si 'nombre' está definido
        });
  
        return combineLatest(
          cursosFiltrados.map(curso => {
            const cursoData = curso.payload.doc.data() as { nombre: string };
            const cursoId = curso.payload.doc.id;
  
            return this.firestore.collection(`cursos/${cursoId}/secciones`, ref =>
              ref.where('profesor.id_profesor', '==', idProfesor)
            ).snapshotChanges().pipe(
              map(secciones => secciones.map(seccion => ({
                id: seccion.payload.doc.id,
                nombre: cursoData.nombre,  // Incluye el nombre del curso
                ...(seccion.payload.doc.data() as object)  // Asegura que los datos sean un objeto
              })))
            );
          })
        );
      }),
      map(cursos => cursos.reduce((acc, val) => acc.concat(val), []))  // Aplana el array de arrays
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
