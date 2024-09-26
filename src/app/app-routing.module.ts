import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'vista-profe',
    loadChildren: () => import('./pages/vista-profe/vista-profe.module').then( m => m.VistaProfePageModule)
  },
  {
    path: 'codigoprofe',
    loadChildren: () => import('./pages/codigoprofe/codigoprofe.module').then( m => m.CodigoprofePageModule)
  },
  {
    path: 'qrprofe',
    loadChildren: () => import('./pages/qrprofe/qrprofe.module').then( m => m.QRProfePageModule)
  },  {
    path: 'lista-pres',
    loadChildren: () => import('./pages/lista-pres/lista-pres.module').then( m => m.ListaPresPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
