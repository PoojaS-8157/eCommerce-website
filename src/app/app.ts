import { CommonModule } from '@angular/common';
import { Component, inject, signal, Signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartItem, CartService } from './service/cart';
import { UserLogin } from './service/user-login';
import { Products } from './service/products';
import { constants } from './constant/Constant';
import { ICartItemDetails, RegisterUser } from './model/user.model';
import { catchError, concatMap, EMPTY, from, map, Observable, tap, toArray } from 'rxjs';
import { GlobalDialogComponent } from './global-dialog.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, GlobalDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = 'eCommerce-website';
  isCartOpen = false;
  loggedInUser: any | null = null;
  userService = inject(UserLogin);
  cartService = inject(CartService);
  productsService = inject(Products);
  router = inject(Router);
  cartList = signal<ICartItemDetails[]>([])
  totalItems$: Observable<number> = this.cartService.getTotalItems$();

  get totalItems(): number {
    return this.cartService.getTotalItems();
  }

  constructor() {
    this.addProductToCart();
    this.loggedInUser = this.userService.loggedInUser;
    this.cartService.productsList.subscribe((items) => {
      this.addToCart(items);
    });
  }

  addToCart(cartItems: CartItem[]): void {
    if (!cartItems?.length) return;

    const loggedInUser = localStorage.getItem(constants.LOGIN_AUTH_KEY);
    const custId = loggedInUser ? JSON.parse(loggedInUser).custId : null;

    if (!custId) {
      console.warn('User not logged in');
      return;
    }

    from(cartItems).pipe(
      concatMap((item) => {
        const payload = {
          CustId: custId,
          ProductId: item.id,
          Quantity: item.quantity ?? 1,
          AddedDate: new Date().toISOString(),
        };

        return this.userService.AddToCart(payload as any);
      })
    ).subscribe({
      next: (response) => {
        console.log('API success:', response);
      },
      error: (error) => {
        console.error('API failed:', error);
      }
    });
  }

  private syncCartServiceFromCartList(items: ICartItemDetails[]): void {
    this.cartService.clear();

    items.forEach((item) => {
      const quantity = item.quantity ?? 1;
      for (let index = 0; index < quantity; index++) {
        this.cartService.addItem({
          id: item.productId,
          name: item.productName ?? item.productShortName,
          price: item.productPrice,
          image: item.productImageUrl ?? '',
        });
      }
    });
  }

  addProductToCart(): void {
    if (this.loggedInUser) {
      this.productsService.getCartItemsByCustomerId(this.loggedInUser?.custId).subscribe({
        next: (response) => {
          const items = response.data ?? [];
           if (!items.length) {
      this.cartService.clear();
      this.cartList.set([]);
      return;
    }
          this.cartList.set(items);
          this.syncCartServiceFromCartList(items);
          console.log('cartList', items);
        },
        error: (err) => {
          console.error('Failed to load cart items from API:', err);
        }
      });
    }

  }

  get cartItems() {
    return this.cartService.items;
  }

  get subtotal(): number {
    return this.cartService.getSubtotal();
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
    if (this.isCartOpen) {
      this.addProductToCart();
    }
  }

  closeCart(): void {
    this.isCartOpen = false;
  }

  navigateToCheckout(): void {
    this.closeCart();
    this.router.navigate(['/checkout']);
  }

  increaseQuantity(productId: number): void {
    const updatedItems = this.cartList().map((item) =>
      item.productId === productId
        ? { ...item, quantity: (item.quantity ?? 1) + 1 }
        : item
    );

    this.cartList.set(updatedItems);
    this.syncCartServiceFromCartList(updatedItems);
  }

  decreaseQuantity(productId: number): void {
    const updatedItems = this.cartList()
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(0, (item.quantity ?? 1) - 1) }
          : item
      )
      .filter((item) => (item.quantity ?? 0) > 0);

    this.cartList.set(updatedItems);
    this.syncCartServiceFromCartList(updatedItems);
  }

  removeItem(productId: number): void {
    const updatedItems = this.cartList().filter(
      (item) => item.productId !== productId
    );
    this.cartList.set(updatedItems);
    this.syncCartServiceFromCartList(updatedItems);
  }

  logout(): void {
    localStorage.removeItem('ecommerce_user');
    this.loggedInUser = null;
    this.router.navigate(['/login']);
  }
}
