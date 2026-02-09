import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductDTO } from '../../Models/Product/product.dto';
import { ProductService } from '../../services/product-service';
import { AuthService } from '../../services/auth-service';
import { CurrentUser } from '../../Models/auth/current-user';
import { Subscription, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-produits',
  imports: [AsyncPipe, RouterLink],
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
    //TODO gerer les errerus (ex si token expire)
    this.products$ = this.productService.products$;
    console.log('Produits chargés :', this.products$);
  }

  deleteProduct(productId: string): void {
    // TODO gerer les erreurs
    this.subscriptions.push(
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          console.log('Produit supprimé avec succès');
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
