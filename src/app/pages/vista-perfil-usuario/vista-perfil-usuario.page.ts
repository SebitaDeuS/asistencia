import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vista-perfil-usuario',
  templateUrl: './vista-perfil-usuario.page.html',
  styleUrls: ['./vista-perfil-usuario.page.scss'],
})
export class VistaPerfilUsuarioPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  userName: string = 'Juan';
  userLastName: string = 'Pérez';
  userCareer: string = 'Ingeniería en informatica';
  userInstitution: string = 'Duoc UC: sede san andres';

}
