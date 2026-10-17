import { Injectable } from '@angular/core';
import { ProductItem } from './products';

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

  get items(): CartItem[] {
    return [...this.cartItems];
  }

  addItem(product: Pick<ProductItem, 'id' | 'name' | 'price' | 'image'>): void {
    const currentItem = this.cartItems.find((item) => item.id === product.id);

    if (currentItem) {
      this.cartItems = this.cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      );
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
  }

  updateQuantity(productId: number, change: number): void {
    this.cartItems = this.cartItems
      .map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + change } : item,
      )
      .filter((item) => item.quantity > 0);
  }

  removeItem(productId: number): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== productId);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  clear(): void {
    this.cartItems = [];
  }
}
