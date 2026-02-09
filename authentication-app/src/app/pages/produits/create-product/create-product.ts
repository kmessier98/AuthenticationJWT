import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { CreateProductDTO } from '../../../Models/Product/create-product-dto';
import { Subscription } from 'rxjs';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-product',
  imports: [ReactiveFormsModule],
  templateUrl: './create-product.html',
  styleUrl: './create-product.scss',
})
export class CreateProduct implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  form!: FormGroup;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      unitPrice: [0, Validators.required],
      quantity: [0, Validators.required],
    });
  }

  get isFormInvalid(): boolean {
    return this.form.invalid;
  }

  get name() {
    return this.form.get('name');
  }

  get description() {
    return this.form.get('description');
  }

  get unitPrice() {
    return this.form.get('unitPrice');
  }

  get quantity() {
    return this.form.get('quantity');
  }

  createProduct(): void {
    //TODO catch error deja crer
    this.subscriptions.push(
      this.productService.createProduct(this.form.value).subscribe({
        next: (createdProduct) => {
          console.log('Produit créé avec succès :', createdProduct);
          //TODO redirect vers la page de  la liste des produits
        },
        error: (error) => {
          console.error('Erreur lors de la création du produit :', error);
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
