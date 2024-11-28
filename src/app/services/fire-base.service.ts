import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { User } from '../models/user.model';
import { catchError, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';  // Necesario para un almacenamiento reactivo
import{Clase} from '../interfaces/i_usuario'
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

  getAsignaturasEstudiante(idEstudiante: string): Observable<any[]> {
    return this.firestore.collection('cursos').snapshotChanges().pipe(
      concatMap(cursos => {
        // Filtrar cursos que tienen al menos una sección con el alumno
        const cursosFiltrados = cursos.filter(curso => {
          const cursoData = curso.payload.doc.data() as { nombre?: string };
          return cursoData.nombre; // Solo pasa si 'nombre' está definido
        });
  
        return combineLatest(
          cursosFiltrados.map(curso => {
            const cursoData = curso.payload.doc.data() as { nombre: string };
            const cursoId = curso.payload.doc.id;
  
            // Obtener las secciones de cada curso y filtrar por el alumno
            return this.firestore.collection(`cursos/${cursoId}/secciones`).snapshotChanges().pipe(
              concatMap(secciones => {
                return combineLatest(
                  secciones.map(seccion => {
                    const seccionData = seccion.payload.doc.data() as { alumnos?: any[] };
                    const seccionId = seccion.payload.doc.id;
                    console.log('Sección ID:', seccionId, 'Datos de alumnos:', seccionData.alumnos);
                    if (!Array.isArray(seccionData.alumnos)) {
                      console.warn(`'alumnos' no es un array en la sección ${seccionId}. Tipo actual:`, typeof seccionData.alumnos);
                    }
                  
                    // Verificar si 'alumnos' es un array
                    if (Array.isArray(seccionData.alumnos)) {
                      // Filtrar las clases donde el alumno está presente
                      const clases = seccionData.alumnos.filter(alumno => alumno.id_alumno === idEstudiante);
  
                      // Si el alumno está en alguna clase, devolver esa asignatura
                      if (clases.length > 0) {
                        return this.firestore.collection(`cursos/${cursoId}/secciones/${seccionId}/Clases`).snapshotChanges().pipe(
                          map(clases => clases.map(clase => {
                            const claseData = clase.payload.doc.data() as Clase; // Aseguramos que los datos son del tipo 'Clase'
                            return {
                              cursoId: cursoId, // ID del curso
                              nombre: cursoData.nombre, // Nombre del curso
                              seccionId: seccionId, // ID de la sección
                              claseId: clase.payload.doc.id, // ID de la clase
                              fecha: clase.payload.doc.id, // La fecha es el ID de la clase
                              alumnos: claseData.alumnos, // Información de los alumnos presentes
                            };
                          }))
                        );
                      }
                    }
  
                    // Si 'alumnos' no es un array o no hay clases, devolver un array vacío
                    return [];
                  })
                );
              }),
              map(asignaturas => asignaturas.reduce((acc, val) => acc.concat(val), [])) // Aplana el array de arrays
            );
          })
        );
      }),
      map(asignaturas => asignaturas.reduce((acc, val) => acc.concat(val), [])) // Aplana el array de asignaturas
    );
  }
  

  getAsignaturasProfesor(idProfesor: string): Observable<any[]> {
    return this.firestore.collection('cursos').snapshotChanges().pipe(
        concatMap(cursos => {
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
                            cursoId: cursoId, // Incluye el cursoId
                            id: seccion.payload.doc.id,
                            nombre: cursoData.nombre, // Incluye el nombre del curso
                            ...(seccion.payload.doc.data() as object) // Asegura que los datos sean un objeto
                        })))
                    );
                })
            );
        }),
        map(cursos => cursos.reduce((acc, val) => acc.concat(val), [])) // Aplana el array de arrays
    );
}
  async updateFechaClase(cursoId: string, asignaturaId: string, seccionId: string, fecha: string) {
    if (!cursoId || !asignaturaId || !seccionId) {
        console.error('Parámetros incompletos:', { cursoId, asignaturaId, seccionId });
        throw new Error('Parámetros incompletos: alguno de los IDs está vacío.');
    }

    try {
        const seccionRef = this.firestore
            .collection('cursos')
            .doc(cursoId)
            .collection('secciones')
            .doc(seccionId);

        const seccionSnapshot = await seccionRef.get().toPromise();

        if (seccionSnapshot.exists) {
            const data = seccionSnapshot.data();

            if (data && data['Clases']) {
                if (data['Clases'].length === 0) {
                    const nuevaClase = {
                        fecha_clase: fecha,
                        alumnos: []
                    };
                    await seccionRef.update({ 'Clases': [nuevaClase] });
                } else {
                    const clase = data['Clases'][0];
                    clase.fecha_clase = fecha;
                    await seccionRef.update({ 'Clases': data['Clases'] });
                }
            } else {
                console.error('No se encontró el array Clases');
            }
        } else {
            console.log('Sección no encontrada. Creando nueva sección...');
            const nuevaSeccion = {
                profesor: { id_profesor: 'some-profesor-id', nombre_profesor: 'Profesor Nombre' },
                Clases: [{ fecha_clase: fecha, alumnos: [] }]
            };
            await seccionRef.set(nuevaSeccion);
            console.log('Sección y clase creadas con éxito');
        }
    } catch (error) {
        console.error('Error al actualizar la fecha de clase:', error);
    }
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

  ///////////////////Vista del alumno///////////////////
  getAlumnoData(correo_alumno: string): Observable<any> {
    console.log('Buscando datos para:', correo_alumno);

    return this.firestore
      .doc('Registro/alumno')  // Accede a la subcolección 'alumno' del documento 'Registro'
      .get()
      .pipe(
        map((doc) => {
          const data = doc.data();
          if (data && data['alumnos']) {
            // Filtrar el alumno que coincida con el correo
            const alumno = data['alumnos'].find(
              (alumno: any) => alumno.correo_alumno === correo_alumno
            );
            console.log('Datos del alumno encontrado:', alumno);
            return alumno || null;
          } else {
            console.log('No se encontraron datos de alumnos');
            return null;
          }
        }),
        catchError((error) => {
          console.error('Error al obtener los datos del alumno:', error);
          return of(null);
        })
      );
  }

}


