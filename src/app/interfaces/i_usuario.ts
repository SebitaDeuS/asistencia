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

  export interface Clase {
    alumnos: { id_alumno: string, nombre_alumno: string, estado: boolean }[];
  }