import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { Login } from './modules/login/login';
import { Home } from './modules/home/home';
import { Main } from './modules/home/main/main';
import { RegisterComponent } from './modules/register/register';
import { ClientDashboardComponent } from './modules/client-dashboard/client-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  {
    path: 'client-dashboard',
    component: ClientDashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard],
    children: [
      { path: '', component: Main },
      {
        path: 'operations',
        loadChildren: () => import('./modules/operation/operation-module').then(m => m.OperationModule)
      },
      {
        path: 'comptes',
        loadChildren: () => import('./modules/compte/compte-module').then(m => m.CompteModule)
      },
      {
        path: 'clients',
        loadChildren: () => import('./modules/client/client-module').then(m => m.ClientModule)
      }
    ]
  }
];
