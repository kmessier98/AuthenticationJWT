import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Accueil } from './pages/accueil/accueil';
import { nonAuthGuard } from './auth/guards/non-auth-guard';
import { authGuard } from './auth/guards/auth-guard';
import { NetworkError } from './pages/network-error/network-error';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'accueil',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [nonAuthGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ],
  },
  {
    path: 'accueil',
    component: Accueil,
    canActivate: [authGuard],
  },
  {
    path: 'network-error',
    component: NetworkError,
  },
  {
    path: '**',
    redirectTo: 'accueil',
  },
];
