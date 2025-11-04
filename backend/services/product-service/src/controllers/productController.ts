import { ProductService } from "../services/productService";

export class ProductController {
  static getAll() { return ProductService.getAll(); }
  static getById(id: string) { return ProductService.getById(id); }
  static create(data: { name: string; price: number; stock: number }) { return ProductService.create(data); }
}