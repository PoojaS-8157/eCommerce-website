import { Routes } from '@angular/router';
import { CheckoutPage } from './pages/checkout-page/checkout-page';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { MyOrders } from './pages/my-orders/my-orders';
import { ProductDetails } from './pages/product-details/product-details';
import { ProductList } from './pages/product-list/product-list';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: Home
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'products',
    component: ProductList
  },
  {
    path: 'checkout',
    component: CheckoutPage
  },
  {
    path: 'open-product/:id',
    component: ProductDetails
  },
  {
    path: 'my-orders',
    component: MyOrders
  }
];
