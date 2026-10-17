import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../service/cart';
import { ProductItem, Products } from '../../service/products';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  product: ProductItem | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productsService: Products,
    private readonly cartService: CartService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    //this.product = this.productsService.getProductById(productId);
  }

  addToCart(): void {
    if (!this.product) {
      return;
    }

    this.cartService.addItem(this.product);
    this.router.navigate(['/checkout']);
  }
}
