import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getUserRoles() {
    return [
      { value: 'User', viewValue: 'Utilisateur' },
      { value: 'Admin', viewValue: 'Administrateur' },
    ];
  }
}
