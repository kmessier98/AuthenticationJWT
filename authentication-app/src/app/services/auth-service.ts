import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { RegisterDTO } from '../Models/auth/register.dto';
import { CurrentUser } from '../Models/auth/current-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  backendUrl = 'https://localhost:7125/api/auth';
  private currentUserSubject: BehaviorSubject<CurrentUser | null>;
  public currentUser$: Observable<CurrentUser | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<CurrentUser | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }


  getUserRoles(): Observable<{ value: string; viewValue: string }[]> {
    return of([
      { value: 'User', viewValue: 'Utilisateur' },
      { value: 'Admin', viewValue: 'Administrateur' },
    ]);
  }

  register(userData: RegisterDTO): Observable<any> {
    return this.http.post(`${this.backendUrl}/register`, userData);
  }

  login(userName: string, password: string): Observable<any> {
    const loginData = { userName, password };

    return this.http.post<{token: string, user: CurrentUser}>(`${this.backendUrl}/login`, loginData)
      .pipe(map(response => {
        const token = response.token;
        const currentUser = response.user; 
        localStorage.setItem('auth_token', token);  
        localStorage.setItem('currentUser', JSON.stringify(response.user)); 
        this.currentUserSubject.next(currentUser);
      }));
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  updateUserProfile(updatedProfile: CurrentUser): Observable<any> {
    return this.http.put(`${this.backendUrl}/UpdateUser`, updatedProfile)
      .pipe(
        map((response: any) => {
          localStorage.setItem('currentUser', JSON.stringify(updatedProfile)); 
          this.currentUserSubject.next(updatedProfile);
        }),
      );
  }
}
