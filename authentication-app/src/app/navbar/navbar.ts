import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { CurrentUser } from '../Models/auth/current-user';
import { Observable, Subscription } from 'rxjs';;
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']  ,
})
export class Navbar implements OnInit {
  currentUrl: string = '';
  currentUser: CurrentUser | null = null;
  subscriptions: Subscription[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {    
    this.subscriptions.push(this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('Current user updated in Navbar:', user); 
    }));   

    //this.currentUser$ = this.authService.currentUser$; Fonctionnerais aussi
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
