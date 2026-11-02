import { TestBed } from '@angular/core/testing';

import { CartService } from './cart';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should emit updated cart after add and quantity update', () => {
    const values: any[] = [];

    service.cartItems$.subscribe((items) => values.push([...items]));

    service.addItem({ id: 1, name: 'Sample Product', price: 10, image: 'test.png' });
    service.updateQuantity(1, 1);

    expect(values.length).toBeGreaterThanOrEqual(2);
    expect(service.items.find((item) => item.id === 1)?.quantity).toBe(2);
  });
});
