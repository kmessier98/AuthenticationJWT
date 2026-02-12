import { Routes } from '@angular/router';
import { nonAuthGuard } from './auth/guards/non-auth-guard';
import { authGuard } from './auth/guards/auth-guard';
import { adminGuard } from './auth/guards/admin-guard';

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
      { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
      { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
    ],
  },
  {
    path: 'accueil',
    loadComponent: () => import('./pages/accueil/accueil').then(m => m.Accueil),
    canActivate: [authGuard],
  },
  {
    path: 'produits',
    loadComponent: () => import('./pages/produits/produits').then(m => m.Produits),
    canActivate: [authGuard],
  },
  {
    path: 'creer-produit',
    loadComponent: () => import('./pages/produits/create-product/create-product').then(m => m.CreateProduct),
    canActivate: [adminGuard],
    data: { role: 'Admin' },
  },
  {
    path: 'chat-rooms',
    loadComponent: () => import('./pages/chatRoom/chat-rooms/chat-rooms').then(m => m.ChatRooms),
    canActivate: [authGuard]
  },
  {
    path: 'chat-rooms/create',
    loadComponent: () => import('./pages/chatRoom/create-chat-room/create-chat-room').then(m => m.CreateChatRoom), 
    canActivate: [adminGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'chat-rooms/:id',
    loadComponent: () => import('./pages/chatRoom/join-chat-room/join-chat-room').then(m => m.JoinChatRoom),
    canActivate: [authGuard]
  },
  {
    path: 'mon-profil',
    loadComponent: () => import('./pages/profil/profil').then(m => m.Profil),
    canActivate: [authGuard],
  },
  {
    path: 'network-error',
    loadComponent: () => import('./pages/network-error/network-error').then(m => m.NetworkError),
  },
  {
    path: '**',
    redirectTo: 'accueil',
  },
];
