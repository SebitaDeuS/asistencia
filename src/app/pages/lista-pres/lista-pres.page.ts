import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Navigation } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FireBaseService } from 'src/app/services/fire-base.service';
import { Alumno } from 'src/app/interfaces/i_usuario';
@Component({
  selector: 'app-lista-pres',
  templateUrl: './lista-pres.page.html',
  styleUrls: ['./lista-pres.page.scss'],
})
export class ListaPresPage implements OnInit {
  cursoId: string = '';
  seccionId: string = ''; 
  fechaHoy: string = '';
  alumnos: any[] ; 
  cursos: string[] = []; 
  constructor(
    private router: Router,
    private firebsv: FireBaseService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
  ) {}

  ngOnInit():void {
   

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
      const fechaFormateada = fechaActual.toLocaleDateString();
this.fechaHoy = `${fechaActual.getDate()}-${fechaActual.getMonth() + 1}-${fechaActual.getFullYear()}`;

this.firebsv.getCursos(this.cursoId,this.seccionId,fechaFormateada).subscribe(alumnos => {
  console.log('IDs de los cursos:', alumnos);
  this.alumnos = alumnos;  // Guardamos los IDs en la variable cursos
});
}



  
  
  
  

  
  
  al_vistaprofe() {
    this.navCtrl.back();
  }
}
