import { CommonModule } from '@angular/common';
import { Component, inject, signal, Signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartItem, CartService } from './service/cart';
import { UserLogin } from './service/user-login';
import { Products } from './service/products';
import { constants } from './constant/Constant';
import { ICartItemDetails, RegisterUser } from './model/user.model';
import { catchError, concatMap, EMPTY, from, map, tap, toArray } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = 'eCommerce-website';
  isCartOpen = false;
  loggedInUser: RegisterUser | undefined;
  userService = inject(UserLogin);
  cartService = inject(CartService);
  productsService = inject(Products);
  router = inject(Router);
  cartList = signal<ICartItemDetails[]>([])

  constructor() {
    this.readUsersData();
    // const loggedInUser = localStorage.getItem(constants.LOGIN_AUTH_KEY);
    // const custId = loggedInUser ? JSON.parse(loggedInUser).custId : null;
    // if (custId) this.addProductToCart(custId);
    this.userService.userLoggedIn.subscribe(() => {
      this.readUsersData();
      const li = localStorage.getItem(constants.LOGIN_AUTH_KEY);
      const id = li ? JSON.parse(li).custId : null;
      if (id) this.addProductToCart(id); this.addProductToCart(id);
    });
  }

  readUsersData(): void {
    if (typeof localStorage !== 'undefined') {
      const loggedInUser = localStorage.getItem(constants.LOGIN_AUTH_KEY);
      if (loggedInUser) {
        const parsed = JSON.parse(loggedInUser);
        console.log('Parsed logged-in user:', parsed);
        this.loggedInUser = parsed;
      }
    }
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
      const payload: any = {
        CustId: custId,
        ProductId: item.id,
        Quantity: item.quantity ?? 1,
        AddedDate: new Date().toISOString()
      };

      return this.userService.AddToCart(payload);
    })
  ).subscribe({
    next: (response) => {
      if (response?.result) {
        alert(`${response.message} `);
      }else{
        alert(`${response.message} `);
      }
      console.log('API success:', response);
    },
    error: (error) => {
      console.error('API failed:', error);
    }
  });
}

  addProductToCart(productId: number): void {
  this.productsService.getCartItemsByCustomerId(productId).subscribe({
    next: (response) => {
      const items = response.data ?? [];
      // replace local cart with API items (map API shape to local CartItem shape)
      this.cartService.clear();
      items.forEach((apiItem: ICartItemDetails) => {
        const mapped = {
          id: apiItem.productId,
          name: apiItem.productName ?? apiItem.productShortName,
          price: apiItem.productPrice,
          image: apiItem.productImageUrl ?? '',
        };
        // addItem initializes quantity to 1 (or increments if exists)
        this.cartService.addItem(mapped);
        // if API quantity > 1, update quantity to match
        if ((apiItem.quantity ?? 1) > 1) {
          this.cartService.updateQuantity(mapped.id, (apiItem.quantity ?? 1) - 1);
        }
      });

      this.cartList.set(items);
      console.log('cartList', items);
    },
    error: (err) => {
      console.error('Failed to load cart items from API:', err);
    }
  });
}

  get cartItems() {
    return this.cartService.items;
  }

  get totalItems(): number {
    return this.cartService.getTotalItems();
  }

  get subtotal(): number {
    return this.cartService.getSubtotal();
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
    if (this.isCartOpen) {
      const loggedInUser = localStorage.getItem(constants.LOGIN_AUTH_KEY);
      const custId = loggedInUser ? JSON.parse(loggedInUser).custId : null;
      if (custId) this.addProductToCart(custId);
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
    this.cartService.updateQuantity(productId, 1);
  }

  decreaseQuantity(productId: number): void {
    this.cartService.updateQuantity(productId, -1);
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  logout(): void {
    localStorage.removeItem('ecommerce_user');
    this.loggedInUser = undefined;
    this.router.navigate(['/login']);
  }
}
