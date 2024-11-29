export interface UsuarioLog{
    email: string;
    password:string,
    nombre_alumno:string,
}
export interface StudentData {
    correo_alumno: string;
    id_alumno: string;
    nombre_alumno: string
  }
  export interface Alumno {
    id_alumno: string;
    nombre_alumno: string;
    estado: boolean;
  }
  export interface Clase {
    fecha: string;  // O el tipo adecuado para la fecha
    nombreAsignatura: string;
    alumnos: Alumno[];
  }