import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Accueil } from './pages/accueil/accueil';
import { nonAuthGuard } from './auth/guards/non-auth-guard';
import { authGuard } from './auth/guards/auth-guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'accueil',
    pathMatch: 'full'
  },
  {
    path: 'register',
    component: Register,
    canActivate: [nonAuthGuard],
  },
  {
    path: 'login',
    component: Login,
    canActivate: [nonAuthGuard],
  },
  {
    path: 'accueil',
    component: Accueil,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'accueil',    
  },
];
