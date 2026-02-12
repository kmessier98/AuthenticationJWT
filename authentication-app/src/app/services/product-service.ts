import { Injectable } from '@angular/core';
import { ProductDTO } from '../Models/Product/product.dto';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, Subscription } from 'rxjs';
import { CreateProduct } from '../pages/produits/create-product/create-product';
import { CreateProductDTO } from '../Models/Product/create-product-dto';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  backendUrl = 'https://localhost:7125/api/product';
  private productsSubject = new BehaviorSubject<ProductDTO[]>([]);
  readonly products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  public searchProducts(filter: string): Observable<ProductDTO[]> {
    return this.http
      .get<ProductDTO[]>(`${this.backendUrl}/GetProducts?name=${filter}`)
      .pipe(tap((products) => this.productsSubject.next(products)));
  }

  loadProducts(): void {
    this.searchProducts('').subscribe();
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.backendUrl}/DeleteProduct/${productId}`).pipe(
      tap(() => {
        const updatedProducts = this.productsSubject.value.filter((p) => p.id !== productId);
        this.productsSubject.next(updatedProducts);
      }),
    );
  }

 createProduct(productData: FormData): Observable<ProductDTO> {
  // Note : On envoie directement le FormData. 
  // Angular détecte le type et configure le "Content-Type" en "multipart/form-data" automatiquement.
  return this.http.post<ProductDTO>(`${this.backendUrl}/AddProduct`, productData).pipe(
    tap((newProduct) => {
      const updatedProducts = [...this.productsSubject.value, newProduct];
      this.productsSubject.next(updatedProducts);
    })
  );
}
}
