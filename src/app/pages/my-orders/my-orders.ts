import { Component, Inject, inject, OnInit } from '@angular/core';
import { Products } from '../../service/products';
import { UserLogin } from '../../service/user-login';
import { ICartItemDetails, IPlaceOrderModel } from '../../model/user.model';
import { switchMap } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { GlobalDialogService } from '../../global-dialog.service';

@Component({
  selector: 'app-my-orders',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.scss',
})
export class MyOrders implements OnInit {
  productService = inject(Products);
  userService = inject(UserLogin);
  globalDialogService = inject(GlobalDialogService);
  orderDetails: (IPlaceOrderModel & { items?: any[] })[] = [];
  orderSummary: ICartItemDetails[] = [];
  ordersWithDetails: any[] = [];
  orders$!: Observable<any[]>;

  constructor(){}

  ngOnInit(): void {
    const loggedInUser = this.userService.loggedInUser as any;

    if (loggedInUser?.custId) {
      this.orders$ = this.productService.getAllSaleByCustomerID(loggedInUser.custId).pipe(
        switchMap((res: any) => {
          const salesList = res.data;
          if (!salesList || salesList.length === 0) {
            this.globalDialogService.open({
              title: 'No orders yet',
              message: 'Your order history is empty right now.',
              type: 'success',
            });
            return of([]);
          }

          const detailRequests = salesList.map((order: any) =>
            this.productService.openSaleBySaleId(order.saleId)
          );

          return forkJoin(detailRequests).pipe(
            switchMap((allSaleDetails: any) => {
              return of(salesList.map((sale: any, index: number) => ({
                ...sale,
                items: allSaleDetails[index]?.data || []
              })));
            })
          );
        })
      );
    } else {
      this.globalDialogService.open({
        title: 'Login required',
        message: 'Please log in to view your order history.',
        type: 'error',
      });
    }
  }
  }

// getUserData() {
//   const loggedInUser = this.userService.loggedInUser as any;
//   if (loggedInUser?.custId) {
//     this.productService.getAllSaleByCustomerID(loggedInUser.custId).pipe(
//       switchMap((res: any) => {
//         const salesList = res.data;

//         if (!salesList || salesList.length === 0) {
//           return of([]);
//         }

//         // Create an array of requests for each saleId
//         const detailRequests = salesList.map((order: any) => 
//           this.productService.openSaleBySaleId(order.saleId)
//         );

//         // Run all API calls in parallel, and combine them with their corresponding sale data
//         return forkJoin(detailRequests).pipe(
//           switchMap((allSaleDetails: any) => {
//             // Merge the salesList header data with their respective product details (.data)
//             const combinedOrders = salesList.map((sale: any, index: number) => {
//               return {
//                 ...sale, // Contains saleId, saleDate, totalInvoiceAmount, etc.
//                 items: allSaleDetails[index]?.data || [] // Contains the specific products for this saleId
//               };
//             });

//             return of(combinedOrders);
//           })
//         );
//       })
//     ).subscribe({
//       next: (finalOrders: any[]) => {
//         console.log('Final Combined Orders:', finalOrders);
//         this.orderDetails = finalOrders; 
//       },
//       error: (err) => {
//         console.error('Error fetching order details:', err);
//       }
//     });
//   } 
// }
//}
