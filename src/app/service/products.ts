import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { constants } from '../constant/Constant';
import { map, Observable, Subject } from 'rxjs';
import { ApiResponse } from '../model/Api.Response.model';
import { IProduct } from '../model/Product.model';
import { ICategory } from '../model/Categories.model';
import { ICartItem, ICartItemDetails } from '../model/user.model';


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
  productsList: Subject<ICartItemDetails[]> = new Subject<ICartItemDetails[]>();

  private readonly catalog: ProductItem[] = [
    {
      id: 1,
      name: 'Classic Leather Jacket',
      category: 'Men',
      price: 299,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      description: 'Premium faux leather jacket with a structured silhouette.',
      longDescription: 'Designed for everyday wear, this jacket offers a modern fit, soft inner lining, and durable finish.',
      badge: 'Best Seller',
    },
    {
      id: 2,
      name: 'Urban Running Shoes',
      category: 'Sports',
      price: 149,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      description: 'Lightweight sneakers built for comfort and movement.',
      longDescription: 'These performance shoes feature responsive cushioning, breathable mesh, and all-day support.',
      badge: 'New',
    },
    {
      id: 3,
      name: 'Minimalist Smart Watch',
      category: 'Electronics',
      price: 219,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      description: 'Elegant smartwatch with fitness tracking and notifications.',
      longDescription: 'Stay connected and on top of your goals with a sleek, durable device and intuitive display.',
      badge: 'Popular',
    },
  ];

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


  getProducts(): ProductItem[] {
    return this.catalog;
  }

  getProductById(id: number): ProductItem | undefined {
    return this.catalog.find((product) => product.id === id);
  }
}
