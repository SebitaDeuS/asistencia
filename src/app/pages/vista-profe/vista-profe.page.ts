import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FireBaseService } from 'src/app/services/fire-base.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-vista-profe',
  templateUrl: './vista-profe.page.html',
  styleUrls: ['./vista-profe.page.scss'],
})
export class VistaProfePage implements OnInit {

  profesorId: string | null = null;
  asignaturas: any[] = []; 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firebaseService: FireBaseService
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      // Obtén profesorId y asignaturas de `state`
      this.profesorId = navigation.extras.state['profesorId'];
      this.asignaturas = navigation.extras.state['asignaturas'];
    } else {
      // Respaldo: obtén profesorId y asignaturas desde sessionStorage
      this.profesorId = sessionStorage.getItem('profesorId');
      this.asignaturas = JSON.parse(sessionStorage.getItem('asignaturas') || '[]');
    }

    console.log('Profesor ID en vista-profe:', this.profesorId);
    console.log('Asignaturas en vista-profe:', this.asignaturas);
  }

  al_codigo(asignaturaId: string, cursoId: string) {
    if (this.profesorId) {
        console.log('Navegando a codigoprofe con:', { profesorId: this.profesorId, asignaturaId, cursoId });
        
        const navigationExtras: NavigationExtras = {
            state: {
                profesorId: this.profesorId,
                asignaturaId: asignaturaId,
                cursoId: cursoId  // Incluimos el cursoId
            }
        };
        this.router.navigate(['/codigoprofe'], navigationExtras);
    } else {
        console.error('No se encontró el ID del profesor');
    }
}
}
