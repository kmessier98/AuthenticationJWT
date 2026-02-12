import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductDTO } from '../../Models/Product/product.dto';
import { ProductService } from '../../services/product-service';
import { AuthService } from '../../services/auth-service';
import { CurrentUser } from '../../Models/auth/current-user';
import {
  Subscription,
  Observable,
  debounce,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-produits',
  imports: [AsyncPipe, RouterLink, ReactiveFormsModule],
  templateUrl: './produits.html',
  styleUrl: './produits.scss',
})
export class Produits implements OnInit, OnDestroy {
  products$: Observable<ProductDTO[]> | null = null;
  currentUser: CurrentUser | null = null;
  subscriptions: Subscription[] = [];
  searchControl = new FormControl('');

  constructor(
    private productService: ProductService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadProducts();
    this.setupSearchListener();
    console.log('Current User:', this.currentUser);
    console.log('Products', this.products$);
  }

  loadCurrentUser(): void {
    this.subscriptions.push(
      this.authService.currentUser$.subscribe((user) => {
        this.currentUser = user;
      }),
    );
  }

  loadProducts(): void {
    this.productService.loadProducts(); //Important de comprendre que ce call se fait une fois dans le OnInit
    this.products$ = this.productService.products$; // Ici ca ne repasse pas dans le ngOnInit, c'est un observable qui est mis à jour par le service, et le composant se met à jour automatiquement grâce à l'AsyncPipe
  }

  setupSearchListener(): void {
    this.subscriptions.push(
      this.searchControl.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((searchTerm) => this.productService.searchProducts(searchTerm || '')),
        )
        .subscribe(),
    );
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

  getProductImageUrl(fileName: string): string {
    return `https://localhost:7125/images/${fileName}`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
