export interface UsuarioLog{
    email: string;
    password:string,
}

export interface User {
    uid: string;
    email: string;
    password: string;
  }

  export interface UsuarioLog {
    email: string;
    password: string;
  }
  
  export interface Alumno {
    id_alumno: string;
    correo_alumno: string;
    contraseña_alumno: string;
  }
  export interface Curso {
    alumnos: Alumno[];
  }