import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'nomina' },
  {
    path: 'nomina',
    title: 'Nómina · MultiHerramientas',
    loadComponent: () => import('./tools/nomina/nomina').then((m) => m.Nomina),
  },
  {
    path: 'descansos',
    title: 'Descansos y almuerzos · MultiHerramientas',
    loadComponent: () => import('./tools/descansos/descansos').then((m) => m.Descansos),
  },
  { path: '**', redirectTo: 'nomina' },
];
