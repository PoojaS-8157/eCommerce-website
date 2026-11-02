import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { constants } from '../constant/Constant';
import { map, Observable, Subject } from 'rxjs';
import { ApiResponse } from '../model/Api.Response.model';
import { IProduct } from '../model/Product.model';
import { ICategory } from '../model/Categories.model';
import { ICartItem, ICartItemDetails, IPlaceOrderModel } from '../model/user.model';
import { env } from 'process';


export interface ProductItem {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  longDescription: string;
  badge: string;
}

@Injectable({
  providedIn: 'root',
})
export class Products {
  http = inject(HttpClient);
  getAllProducts(): Observable<ApiResponse<IProduct[]>> {
    return this.http.get<ApiResponse<IProduct[]>>(environment.API_URL + constants.API_ENDPOINTS.ALL_PRODUCTS);
  }

  getAllCategories(): Observable<ICategory[]> {
    return this.http.get<ApiResponse<ICategory[]>>(environment.API_URL + constants.API_ENDPOINTS.GET_CATEGORY_PRODUCTS).pipe(
      map((response: ApiResponse<ICategory[]>) => {
        const categories = response.data ?? [];
        return [
          { categoryId: 0, categoryName: 'All', parentCategoryId: 0, userId: 0 },
          ...categories,
        ];
      })
    );
  }
  filterProductsByCategoryId(categoryId: number): Observable<ApiResponse<IProduct[]>> {
    return this.http.get<ApiResponse<IProduct[]>>(environment.API_URL + constants.API_ENDPOINTS.FILTER_PRODUCTS_BY_CAT_ID + categoryId);
  }

  addToCart(productId: number): Observable<ApiResponse<ICartItem>> {
    return this.http.post<ApiResponse<ICartItem>>(environment.API_URL + constants.API_ENDPOINTS.ADD_TO_CART, { productId });
  }

  getCartItemsByCustomerId(customerId: number): Observable<ApiResponse<ICartItem[]>> {
    return this.http.get<ApiResponse<ICartItem[]>>(environment.API_URL + constants.API_ENDPOINTS.GET_CART_ITEMS + customerId);
  }

  placeOrder(orderData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(environment.API_URL + constants.API_ENDPOINTS.PLACE_ORDER, orderData);
  }
  getAllSaleByCustomerID(sallerId: number): Observable<ApiResponse<IPlaceOrderModel[]>>{
    return this.http.get<ApiResponse<IPlaceOrderModel[]>>(environment.API_URL + constants.API_ENDPOINTS.GET_ALL_SALE_BY_CUSTOMER_ID + sallerId);
  }

  openSaleBySaleId(saleId: number): Observable<ApiResponse<ICartItemDetails[]>>{
    return this.http.get<ApiResponse<ICartItemDetails[]>>(environment.API_URL + constants.API_ENDPOINTS.OPEN_SALE_BY_SALE_ID + saleId)
  }
}
