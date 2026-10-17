import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../service/cart';
import { ProductItem, Products } from '../../service/products';
import { ApiResponse } from '../../model/Api.Response.model';
import { IProduct } from '../../model/Product.model';
import { ICategory } from '../../model/Categories.model';
import { map, Observable, pipe, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  constructor(
    private readonly productsService: Products,
    private readonly cartService: CartService,
    private readonly router: Router,
  ) {}

  productList = signal<IProduct[]>([]);
  $categoryList: Observable<ICategory[]> = new Observable<ICategory[]>();
  selectedCategory = signal<number>(0);

  ngOnInit(): void {
    this.getAllProducts();
    this.$categoryList = this.productsService.getAllCategories().pipe(
      tap((categories: ICategory[]) => {
        if (categories && categories.length > 0) {
          this.selectedCategory.set(categories[0].categoryId);
        }
      })
    );
  }
  
  getAllProducts(): void {
    this.productsService.getAllProducts().subscribe({
      next: (response: ApiResponse<IProduct[]>) => {
        this.productList.set(response.data);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  selectCategory(categoryId: number): void {
    this.selectedCategory.set(categoryId);
    if (categoryId === 0) {
      this.getAllProducts();
      return;
    }else { 
    this.productsService.filterProductsByCategoryId(categoryId).subscribe({
      next: (response: ApiResponse<IProduct[]>) => {
        this.productList.set(response.data);
      },
      error: (error) => {
        console.error(`Error fetching products for Category ID ${categoryId}:`, error);
      }
    });
    }
  }

  addToCart(productId: number): void {
    // The product list is populated from the API (IProduct shape). Don't rely
    // on the local Products.catalog when adding items — map the API product
    // shape into the CartService expected shape.
    const apiProduct = this.productList().find((p: any) => p.productId === productId);
    if (!apiProduct) {
      // fallback to local catalog if available
      const local = this.productsService.getProductById(productId);
      if (!local) return;
      this.cartService.addItem({ id: local.id, name: local.name, price: local.price, image: local.image });
      return;
    }

    this.cartService.addItem({
      id: apiProduct.productId,
      name: apiProduct.productName,
      price: apiProduct.productPrice,
      image: apiProduct.productImageUrl ?? ''
    });
    //this.productsService.productsList.next();
  }

  getQuantity(productId: number): number {
    const item = this.cartService.items.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  }

  increaseQuantity(productId: number): void {
    this.cartService.updateQuantity(productId, 1);
  }

  decreaseQuantity(productId: number): void {
    this.cartService.updateQuantity(productId, -1);
  }
}
