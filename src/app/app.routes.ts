import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.component').then((m) => m.RegistroComponent),
  },
  {
    path: 'liga',
    loadComponent: () => import('./liga/liga.component').then((m) => m.LigaComponent),
  },
  {
    path:'perfil',
    loadComponent: () => import('./perfil/perfil.component').then((m) => m.PerfilComponent),
  },
  {
    path:'ranking',
    loadComponent: () => import('./ranking/ranking.component').then((m) => m.RankingComponent),
  },
  {
    path:'historial',
    loadComponent: () => import('./historial/historial.component').then((m) => m.HistorialComponent),
  },
  {
    path:'partido/:id',
    loadComponent: () => import('./partido/partido.component').then((m) => m.PartidoComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
