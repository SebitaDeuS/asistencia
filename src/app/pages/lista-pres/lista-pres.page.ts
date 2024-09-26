import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-pres',
  templateUrl: './lista-pres.page.html',
  styleUrls: ['./lista-pres.page.scss'],
})
export class ListaPresPage implements OnInit {

  constructor(private router: Router) { }
al_vistaprofe(){
  this.router.navigate(["/codigoprofe"])
}
  ngOnInit() {
  }

}
