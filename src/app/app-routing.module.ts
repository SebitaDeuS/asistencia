import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    data: { title: 'Principal' } // Título para la página Home
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
    path: 'vista-qr',
    loadChildren: () => import('./pages/vista-qr/vista-qr.module').then( m => m.VistaQrPageModule),
    data: { title: 'Escanerar codigo' } // Título para la página Home
  },
  {
    path: 'vista-asistencia',
    loadChildren: () => import('./pages/vista-asistencia/vista-asistencia.module').then( m => m.VistaAsistenciaPageModule),
    data: { title: 'Asistencia' } // Título para la página Home
  },
  {
    path: 'vista-olvide-contrasennia',
    loadChildren: () => import('./pages/vista-olvide-contrasennia/vista-olvide-contrasennia.module').then( m => m.VistaOlvideContrasenniaPageModule)
  },
  {
    path: 'vista-perfil-usuario',
    loadChildren: () => import('./pages/vista-perfil-usuario/vista-perfil-usuario.module').then( m => m.VistaPerfilUsuarioPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
