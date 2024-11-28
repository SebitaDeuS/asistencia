import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { User } from '../models/user.model';
import { catchError, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';  // Necesario para un almacenamiento reactivo
import { Network } from '@capacitor/network';
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

  getProfesorId(): Observable<string | null> {
    return this.auth.authState.pipe(map(user => user ? user.uid : null));
  }



  getAsignaturasProfesor(idProfesor: string): Observable<any[]> {
    return this.firestore.collection('cursos').snapshotChanges().pipe(
      concatMap((cursos) => {
        const cursosFiltrados = cursos.filter((curso) => {
          const cursoData = curso.payload.doc.data() as { nombre?: string };
          return cursoData.nombre; 
        });
  
        return combineLatest(
          cursosFiltrados.map((curso) => {
            const cursoData = curso.payload.doc.data() as { nombre: string };
            const cursoId = curso.payload.doc.id;
  
            return this.firestore.collection(`cursos/${cursoId}/secciones`, (ref) =>
              ref.where('profesor.id_profesor', '==', idProfesor)
            ).snapshotChanges().pipe(
              map((secciones) =>
                secciones.map((seccion) => ({
                  cursoId: cursoId,
                  id: seccion.payload.doc.id, 
                  nombre: cursoData.nombre, 
                  ...(seccion.payload.doc.data() as object), 
                }))
              )
            );
          })
        );
      }),
      map((cursos) => cursos.reduce((acc, val) => acc.concat(val), [])) 
    );
  }
  

   async guardarAsignaturaEnFirebase(asignatura: any) {
    try {
      const cursoRef = this.firestore.collection('cursos').doc(asignatura.cursoId);
      await cursoRef.set({ nombre: asignatura.nombre });
  
      const seccionRef = cursoRef.collection('secciones').doc(asignatura.seccionId);
      await seccionRef.set({
        profesor: {
          id_profesor: asignatura.profesorId,
          nombre_profesor: asignatura.profesorNombre,
        },
        alumnos: [],
      });
  
      const clasesRef = seccionRef.collection('Clases').doc('plantilla');
      await clasesRef.set({ alumnos: [] });
  
      console.log(`Asignatura "${asignatura.nombre}" guardada en Firebase.`);
    } catch (error) {
      console.error('Error al guardar asignatura en Firebase:', error);
      throw error;
    }
  }

  // Guardar asignatura localmente
  guardarAsignaturaPendiente(asignatura: any): void {
    const asignaturasPendientes = JSON.parse(localStorage.getItem('asignaturasPendientes') || '[]');
    asignaturasPendientes.push(asignatura);
    localStorage.setItem('asignaturasPendientes', JSON.stringify(asignaturasPendientes));
    console.log('Asignatura guardada localmente:', asignatura);
  }

  // Sincronizar asignaturas pendientes
  async sincronizarAsignaturasPendientes(): Promise<void> {
    const status = await Network.getStatus();

    if (status.connected) {
      const asignaturasPendientes = JSON.parse(localStorage.getItem('asignaturasPendientes') || '[]');

      for (const asignatura of asignaturasPendientes) {
        await this.guardarAsignaturaEnFirebase(asignatura);
        console.log(`Asignatura "${asignatura.nombre}" sincronizada con Firebase.`);
      }

      // Limpiar asignaturas pendientes
      localStorage.removeItem('asignaturasPendientes');
    } else {
      console.log('Sin conexión a Internet. No se pueden sincronizar asignaturas.');
    }
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


