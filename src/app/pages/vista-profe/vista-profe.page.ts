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

  asignaturas: any[] = []; 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firebaseService: FireBaseService
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const profesorId = params.get('profesorId');
      console.log('ID Profesor recibido:', profesorId); 
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

    const profesorId = this.route.snapshot.queryParamMap.get('profesorId');
    
    if (profesorId) {
   
      this.router.navigate(['/codigoprofe'], { queryParams: { profesorId, asignaturaId } });

    } else {
      console.error('No se encontró el ID del profesor');
    }
  }
}
