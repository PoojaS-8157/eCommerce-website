import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { constants } from '../constant/Constant';
import { Observable, Subject } from 'rxjs';
import { ApiResponse } from '../model/Api.Response.model';
import { ICartItem, ILoginUser, RegisterUser } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserLogin {
  http = inject(HttpClient);
  userLoggedIn: Subject<void> = new Subject<void>();

  registerUser(userData: RegisterUser): Observable<any> {
    return this.http.post(environment.API_URL + '/' + constants.API_ENDPOINTS.REGISTER_USER, userData);
  }

  loginUser(userData: ILoginUser): Observable<any> {
    return this.http.post(environment.API_URL + '/' + constants.API_ENDPOINTS.LOGIN_USER, userData);
  }

  AddToCart(cartData: ICartItem): Observable<any> {
    return this.http.post(environment.API_URL + '/' + constants.API_ENDPOINTS.ADD_TO_CART, cartData);
  }
}
