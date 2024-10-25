import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
@Injectable({
  providedIn: 'root'
})
export class AlmacenamientoService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
   }

   async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  
  public guardar(key: string, value: any) {
    this._storage?.set(key, value);
  }

  public async leer(key:string){
    return await this._storage?.get(key);
  }


  public async remover(key:string){
    await this._storage?.remove(key);
  }
  public  async registrarusuario(usuario:{username:String, nombre:String,apellido:String, password:String}){
    const usuarios= await this.leer('usuarios')||[];

    const usuarioExistente=usuarios.find((u:any)=>usuario.username===usuario.username)

    if(usuarioExistente){
      throw new Error('El nombre del usuario ya existe pajaron')
    }
    usuarios.push(usuario);
    await this.guardar('usuarios',usuarios);

  }
  public async obtenerusuarios(){
    return await this.leer('usuarios')||[];
  }
  public async eliminar_usuario(username:String){
    let usuarios=await this.leer('usuarios')||[];
    usuarios=usuarios.filter((u:any)=>u.username!==username);
    await this.guardar('usuarios',usuarios)
  }
}

