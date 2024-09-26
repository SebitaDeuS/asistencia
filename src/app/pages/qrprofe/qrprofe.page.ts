import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qrprofe',
  templateUrl: './qrprofe.page.html',
  styleUrls: ['./qrprofe.page.scss'],
})
export class QRProfePage implements OnInit {

  constructor( private router:Router) { }

  ngOnInit() {
  }
  al_vistaprofe(){
    this.router.navigate(["/codigoprofe"])
  }

}
