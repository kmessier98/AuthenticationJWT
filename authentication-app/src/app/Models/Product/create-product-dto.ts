export class CreateProductDTO {
  name!: string;
  description!: string;
  unitPrice!: number;
  quantity!: number;
  file: File | null = null;
}
