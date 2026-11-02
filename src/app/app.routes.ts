import { Routes } from '@angular/router';
import { CheckoutPage } from './pages/checkout-page/checkout-page';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { MyOrders } from './pages/my-orders/my-orders';
import { ProductDetails } from './pages/product-details/product-details';
import { ProductList } from './pages/product-list/product-list';
import { authGuard } from './guard/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'products',
    component: ProductList,
    canActivate: [authGuard]
  },
  {
    path: 'checkout',
    component: CheckoutPage,
    canActivate: [authGuard]
  },
  {
    path: 'open-product/:id',
    component: ProductDetails,
    canActivate: [authGuard]
  },
  {
    path: 'my-orders',
    component: MyOrders,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
