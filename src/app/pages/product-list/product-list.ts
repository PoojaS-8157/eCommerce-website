import { CommonModule } from '@angular/common';
import { Component, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../service/cart';
import { Products } from '../../service/products';
import { IProduct } from '../../model/Product.model';
import { ApiResponse } from '../../model/Api.Response.model';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  products: any[] =[];

  constructor(
    private readonly productsService: Products,
    private readonly cartService: CartService,
    private readonly router: Router,
  ) {
     this.productsService.getAllProducts().subscribe({
          next: (response: ApiResponse<IProduct[]>) => {
            this.products = response.data;
            console.log('Fetched products:', this.products);
          },
          error: (error) => {
            console.error('Error fetching products:', error);
          }
        });
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/open-product', productId]);
  }

  addToCart(event: Event, productId: number): void {
    event.stopPropagation();
    const product = this.productsService.getProductById(productId);

    if (!product) {
      return;
    }

    this.cartService.addItem(product);
    this.router.navigate(['/checkout']);
  }
}
