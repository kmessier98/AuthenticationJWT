import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductDTO } from '../../Models/Product/product.dto';
import { ProductService } from '../../services/product-service';
import { AuthService } from '../../services/auth-service';
import { CurrentUser } from '../../Models/auth/current-user';
import { Subscription, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-produits',
  imports: [AsyncPipe],
  templateUrl: './produits.html',
  styleUrl: './produits.scss',
})
export class Produits implements OnInit, OnDestroy {
  products$: Observable<ProductDTO[]> | null = null;
  currentUser: CurrentUser | null = null;
  subscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadProducts();
  }

  loadCurrentUser(): void {
    this.subscriptions.push(
      this.authService.currentUser$.subscribe((user) => {
        this.currentUser = user;
      }),
    );
  }

  loadProducts(): void {
    this.products$ = this.productService.products$;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
