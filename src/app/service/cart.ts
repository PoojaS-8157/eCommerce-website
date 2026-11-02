import { Injectable } from '@angular/core';
import { ProductItem } from './products';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  productsList: Subject<CartItem[]> = new Subject<CartItem[]>();

  get items(): CartItem[] {
    return this.cartItems;
  }

  addItem(product: Pick<ProductItem, 'id' | 'name' | 'price' | 'image'>): void {
    const currentItem = this.cartItems.find((item) => item.id === product.id);

    if (currentItem) {
      this.cartItems = this.cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      );
      this.cartItemsSubject.next(this.cartItems);
      this.productsList.next(this.cartItems);
      return;
    }

    this.cartItems = [
      ...this.cartItems,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      },
    ];
    this.cartItemsSubject.next(this.cartItems);
    this.productsList.next(this.cartItems);
  }

  updateQuantity(productId: number, change: number): void {
    this.cartItems = this.cartItems
      .map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + change } : item,
      )
      .filter((item) => item.quantity > 0);

    this.cartItemsSubject.next(this.cartItems);
    this.productsList.next(this.cartItems);
  }

  removeItem(productId: number): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== productId);
    this.cartItemsSubject.next(this.cartItems);
    this.productsList.next(this.cartItems);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalItems$(): Observable<number> {
    return this.cartItems$.pipe(
      map((items) => items.reduce((total, item) => total + (item.quantity || 0), 0)),
    );
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  clear(): void {
    this.cartItems = [];
    this.cartItemsSubject.next(this.cartItems);
    this.productsList.next(this.cartItems);
  }
}
