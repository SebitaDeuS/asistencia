import { Injectable , inject} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class FireBaseService {

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

  // Método para obtener las asignaturas que imparte el profesor
  getAsignaturasProfesor(profesorId: string): Observable<any[]> {
    return this.firestore
      .collection('cursos')
      .doc(profesorId)
      .collection('secciones')
      .valueChanges({ idField: 'id' });
  }
}
