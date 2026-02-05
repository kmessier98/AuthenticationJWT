import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RegisterDTO } from '../Models/register.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  backendUrl = 'https://localhost:7125/api/auth';

  constructor(private http: HttpClient) {}

  getUserRoles(): Observable<{ value: string; viewValue: string }[]> {
    return of([
      { value: 'User', viewValue: 'Utilisateur' },
      { value: 'Admin', viewValue: 'Administrateur' },
    ]);
  }

  register(userData: RegisterDTO): Observable<any> {
    return this.http.post(`${this.backendUrl}/register`, userData);
    // return this.http.get(this.backendUrl + '/test');
  }

  login(userName: string, password: string): Observable<string> {
    const loginData = { userName, password };

    return this.http.post<string>(`${this.backendUrl}/login`, loginData);
  }
}
