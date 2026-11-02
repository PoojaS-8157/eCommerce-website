import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Products } from '../../service/products';
import { UserLogin } from '../../service/user-login';
import { ICartItemDetails } from '../../model/user.model';
import { map, Observable } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GlobalDialogService } from '../../global-dialog.service';
import { Router } from '@angular/router';

interface CheckoutOrder {
  saleId: number;
  custId: number;
  saleDate: string;
  totalInvoiceAmount: number;
  discount: number;
  paymentNaration: string;
  deliveryAddress1: string;
  deliveryAddress2: string;
  deliveryCity: string;
  deliveryPinCode: string;
  deliveryLandMark: string;
  isCanceled: boolean;
}

@Component({
  selector: 'app-checkout-page',
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.scss',
})
export class CheckoutPage {
  private readonly fb = inject(FormBuilder);
  productService = inject(Products);
  userService = inject(UserLogin);
  dialogService = inject(GlobalDialogService);

  cartItems: ICartItemDetails[] = [];
  cartList$: Observable<ICartItemDetails[]> = new Observable<ICartItemDetails[]>();
  router = inject(Router);

  orderForm = this.fb.group({
    deliveryAddress1: ['', Validators.required],
    deliveryAddress2: [''],
    deliveryCity: ['', Validators.required],
    deliveryPinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    deliveryLandMark: [''],
    paymentNaration: ['Order placed with COD / collection flow', Validators.required],
    isCanceled: [false],
  });

  order: CheckoutOrder = {
    saleId: 1001,
    custId: 2147483647,
    saleDate: new Date().toISOString(),
    totalInvoiceAmount: 0,
    discount: 150,
    paymentNaration: 'Order placed with COD / collection flow',
    deliveryAddress1: '',
    deliveryAddress2: '',
    deliveryCity: '',
    deliveryPinCode: '',
    deliveryLandMark: '',
    isCanceled: false,
  };

  constructor() {
    const loggedInUser = this.userService.loggedInUser as any;

    this.orderForm.patchValue({
      deliveryAddress1: this.order.deliveryAddress1,
      deliveryAddress2: this.order.deliveryAddress2,
      deliveryCity: this.order.deliveryCity,
      deliveryPinCode: this.order.deliveryPinCode,
      deliveryLandMark: this.order.deliveryLandMark,
      paymentNaration: this.order.paymentNaration,
      isCanceled: this.order.isCanceled,
    });

    if (loggedInUser?.custId) {
      this.cartList$ = this.productService.getCartItemsByCustomerId(loggedInUser.custId).pipe(
        map((res: any) => {
          const data = res?.data ?? res;
          return Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
        })
      );

      this.cartList$.subscribe((items) => {
        this.cartItems = items ?? [];
        this.order.custId = loggedInUser.custId;
        this.order.totalInvoiceAmount = this.total;
      });
    }
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + Number(item.productPrice ?? 0) * Number(item.quantity ?? 0), 0);
  }

  get total(): number {
    return this.subtotal - this.order.discount;
  }

  placeOrder(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const loggedInUser = this.userService.loggedInUser as any;
    const payload = {
      custId: loggedInUser?.custId ?? this.order.custId,
      saleDate: new Date().toISOString(),
      totalInvoiceAmount: this.total,
      discount: this.order.discount,
      paymentNaration: this.orderForm.get('paymentNaration')?.value,
      deliveryAddress1: this.orderForm.get('deliveryAddress1')?.value,
      deliveryAddress2: this.orderForm.get('deliveryAddress2')?.value,
      deliveryCity: this.orderForm.get('deliveryCity')?.value,
      deliveryPinCode: this.orderForm.get('deliveryPinCode')?.value,
      deliveryLandMark: this.orderForm.get('deliveryLandMark')?.value,
      isCanceled: !!this.orderForm.get('isCanceled')?.value,
      items: this.cartItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        productPrice: item.productPrice,
      })),
    };

    this.productService.placeOrder(payload).subscribe({
      next: (response) => {
        if (response.result) {
          this.dialogService.open({
            title: 'Order placed',
            message: response?.message || 'Your order has been placed successfully.',
            type: 'success',
            onConfirm: () => this.router.navigateByUrl('/my-orders'),
          });
          return;
        }
        this.dialogService.open({
          title: 'Order not placed',
          message: response?.message || 'Unable to place your order right now.',
          type: 'error',
        });
      },
      error: (error) => {
        console.error('Place order failed:', error);
        this.dialogService.open({
          title: 'Order failed',
          message: error?.message || 'Order placement failed. Please try again.',
          type: 'error',
        });
      },
    });
  }
}
