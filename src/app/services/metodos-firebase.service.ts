import { collection, collectionData, Firestore, query, where } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetodosFirebaseService {

  constructor(
    private firestore:Firestore
  ) { }
  //obtener los datos de la tabla registro
  getData(id_alumno: string): Observable<any> {
    const ref = collection(this.firestore, 'Registro');
    const queryRef = query(ref, where('id_alumno', '==', id_alumno));
    return collectionData(queryRef, { idField: 'id' }) as Observable<any>;
}

}
