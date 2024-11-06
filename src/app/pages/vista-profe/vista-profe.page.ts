import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FireBaseService } from 'src/app/services/fire-base.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-vista-profe',
  templateUrl: './vista-profe.page.html',
  styleUrls: ['./vista-profe.page.scss'],
})
export class VistaProfePage implements OnInit {

  asignaturas: any[] = []; // Almacenará las asignaturas del profesor

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firebaseService: FireBaseService
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const profesorId = params.get('profesorId');
      console.log('ID Profesor recibido:', profesorId); // Verifica si se obtiene correctamente
      if (profesorId) {
        this.firebaseService.getAsignaturasProfesor(profesorId).subscribe(asignaturas => {
          this.asignaturas = asignaturas;
          console.log('Asignaturas del profesor:', this.asignaturas);
        });
      } else {
        console.error('No se encontró el ID del profesor');
      }
    });
  }

  al_codigo(asignaturaId: string) {
    // Recuperar el ID del profesor desde la URL
    const profesorId = this.route.snapshot.queryParamMap.get('profesorId');
    
    if (profesorId) {
      // Navegar a la página Codigoprofe con ambos parámetros
      this.router.navigate(['/codigoprofe'], { queryParams: { profesorId, asignaturaId } });

    } else {
      console.error('No se encontró el ID del profesor');
    }
  }
}
