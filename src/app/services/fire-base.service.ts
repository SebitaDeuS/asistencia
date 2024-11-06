import { Injectable , inject} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

  import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword ,updateProfile} from 'firebase/auth';
import { User } from '../models/user.model';

AngularFireAuth

@Injectable({
  providedIn: 'root'
})
export class FireBaseService {

  auth = inject(AngularFireAuth); 

 
  /* ########### Autenticacion ###########*/

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  updateUser(displayName: string){
    return updateProfile(getAuth().currentUser,{ displayName })
  }
}
