import { Injectable } from '@angular/core';
import { ProductDTO } from '../Models/Product/product.dto';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  backendUrl = 'https://localhost:7125/api/product';
  private productsSubject = new BehaviorSubject<ProductDTO[]>([]);
  readonly products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getProducts();
  }

  getProducts(): void {
    this.http
      .get<ProductDTO[]>(this.backendUrl + '/GetProducts')
      .pipe(tap((products) => this.productsSubject.next(products)))
      .subscribe();
  }
}
