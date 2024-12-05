import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FireBaseService } from 'src/app/services/fire-base.service';

@Component({
  selector: 'app-lista-pres',
  templateUrl: './lista-pres.page.html',
  styleUrls: ['./lista-pres.page.scss'],
})
export class ListaPresPage implements OnInit {
  cursoId: string = '';
  seccionId: string = ''; 
  fechaHoy: string = '';
  alumnos: any[] = []; 
  constructor(
    private router: Router,
    private firebsv: FireBaseService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.cursoId = navigation.extras.state['cursoId'];
      this.seccionId = navigation.extras.state['asignaturaId']; 
      console.log('Datos recibidos:', { cursoId: this.cursoId, seccionId: this.seccionId });
    } else {
      this.cursoId = sessionStorage.getItem('cursoId') || '';
      this.seccionId = sessionStorage.getItem('asignaturaId') || ''; 
    }
  
    const fechaActual = new Date();
    this.fechaHoy = `${fechaActual.getDate()}-${fechaActual.getMonth() + 1}-${fechaActual.getFullYear()}`;
  
    if (this.cursoId && this.seccionId) {
      this.cargarAsistencia();
    }
  }
  
  
  

  cargarAsistencia() {
    if (this.cursoId && this.seccionId && this.fechaHoy) {
      console.log(`Ruta Firestore: cursos/${this.cursoId}/secciones/${this.seccionId}/Clases/${this.fechaHoy}/alumnos`);
      this.firebsv.getAsistenciaPorFechaYSeccion(this.cursoId, this.seccionId, this.fechaHoy).subscribe(
        (data) => {
          console.log('Datos de alumnos:', data); // Verifica la estructura de los datos
          this.alumnos = data;
          console.log('Alumnos presentes:', this.alumnos);
        },
        (error) => {
          console.error('Error al cargar la asistencia:', error);
        }
      );
    } else {
      console.error('Faltan datos para cargar la asistencia:', {
        cursoId: this.cursoId,
        seccionId: this.seccionId,
        fechaHoy: this.fechaHoy
      });
    }
  }
  

  al_vistaprofe() {
    this.navCtrl.back();
  }
}
