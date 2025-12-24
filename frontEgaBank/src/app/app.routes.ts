import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path : '', redirectTo : 'home', pathMatch:'full'
  },
  {
    path: 'home', loadChildren: () => import('./modules/home/home-module').then(m => m.HomeModule)
  },
  {
    path: 'operations', loadChildren: () => import('./modules/operation/operation-module').then(m => m.OperationModule)
  },
  {
    path: 'comptes', loadChildren: () => import('./modules/compte/compte-module').then(m => m.CompteModule)
  },
  {
    path: 'clients', loadChildren: () => import('./modules/client/client-module').then(m => m.ClientModule)
  },
];
