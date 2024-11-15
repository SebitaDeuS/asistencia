import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { User } from '../models/user.model';
import { catchError, Observable } from 'rxjs';
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
  async updateFechaClase(cursoId: string, asignaturaId: string, seccionId: string, fecha: string) {
    try {
      // Obtener la referencia a la sección específica
      const seccionRef = this.firestore
        .collection('cursos')
        .doc(asignaturaId)  // Accede a la asignatura
        .collection('secciones')
        .doc(seccionId);    // Accede a la sección específica
  
      // Obtener el documento de la sección
      const seccionSnapshot = await seccionRef.get().toPromise();
  
      if (seccionSnapshot.exists) {
        const data = seccionSnapshot.data();
  
        // Verificar si el array 'Clases' existe
        if (data && data['Clases']) {
          // Si el array Clases está vacío, creamos una nueva clase
          if (data['Clases'].length === 0) {
            const nuevaClase = {
              fecha_clase: fecha,
              alumnos: []  // Puedes añadir los alumnos aquí si es necesario
            };
            await seccionRef.update({
              'Clases': [nuevaClase]  // Añadimos la nueva clase al array Clases
            });
          } else {
            // Si ya existe al menos una clase, actualizamos la fecha de la primera
            const clase = data['Clases'][0]; // Aquí accedemos con notación de corchetes
            clase.fecha_clase = fecha;
  
            // Actualizamos el documento con el array modificado
            await seccionRef.update({
              'Clases': data['Clases']  // Actualizamos el array completo de Clases
            });
          }
        } else {
          console.error('No se encontró el array Clases');
        }
      } else {
        console.log('Sección no encontrada. Creando nueva sección...');
        // Si no existe la sección, crearla con una nueva clase
        const nuevaSeccion = {
          profesor: {
            id_profesor: 'some-profesor-id',  // Aquí debes agregar el ID del profesor
            nombre_profesor: 'Profesor Nombre'  // Aquí debes agregar el nombre del profesor
          },
          Clases: [
            {
              fecha_clase: fecha,
              alumnos: []  // Puedes añadir los alumnos aquí si es necesario
            }
          ]
        };
        await seccionRef.set(nuevaSeccion);  // Crea la sección con la clase
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


