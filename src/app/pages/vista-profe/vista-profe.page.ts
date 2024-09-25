import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vista-profe',
  templateUrl: './vista-profe.page.html',
  styleUrls: ['./vista-profe.page.scss'],
})
export class VistaProfePage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  al_codigo(){
    this.router.navigate(["/codigoprofe"]);
  }
}
