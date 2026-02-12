import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { CreateProductDTO } from '../../../Models/Product/create-product-dto';
import { Subscription } from 'rxjs';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-product',
  imports: [ReactiveFormsModule],
  templateUrl: './create-product.html',
  styleUrl: './create-product.scss',
})
export class CreateProduct implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  form!: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      unitPrice: [0, Validators.required],
      quantity: [1, Validators.required],
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
    const formData = new FormData(); // Pour pouvoir envoyer un fichier faut absolument utiliser un FormData, c'est la seule façon d'encoder correctement les données pour que le backend puisse les recevoir et les traiter comme un fichier multipart/form-data
    // On ajoute les champs textuels
    formData.append('Name', this.form.value.name);
    formData.append('Description', this.form.value.description);
    formData.append('Quantity', this.form.value.quantity.toString());
    formData.append('UnitPrice', this.form.value.unitPrice.toString());

    // On ajoute le fichier binaire (le fameux selectedFile)
    if (this.selectedFile) {
      // Le premier argument 'File' doit matcher exactement le nom de la propriété dans ton CreateProductDTO en C#
      formData.append('File', this.selectedFile, this.selectedFile.name);
    }

    this.subscriptions.push(
      this.productService.createProduct(formData).subscribe({
        next: (createdProduct) => {
          console.log('Produit créé avec succès :', createdProduct);
          this.location.back();
        },
        error: (error) => {
          console.error('Erreur lors de la création du produit :', error);
          if (error.status === 409) {
            this.form.setErrors({ duplicateName: true });
          }
        },
      }),
    );
  }

  onfileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
      console.log('Fichier sélectionné :', file);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
