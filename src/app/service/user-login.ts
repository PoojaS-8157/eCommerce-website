import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { constants } from '../constant/Constant';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApiResponse } from '../model/Api.Response.model';
import { ICartItem, ILoginUser, RegisterUser } from '../model/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserLogin {
  http = inject(HttpClient);
  platformID = inject(PLATFORM_ID)
  userLoggedIn: Subject<void> = new Subject<void>();
  loggedInUser: RegisterUser | string | null = null;
  private loadingSub = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSub.asObservable();

  constructor() {
    this.readUsersData();
  }

  readUsersData(): void {
    if (isPlatformBrowser(this.platformID)) {
      const loggedInUser = localStorage.getItem(constants.LOGIN_AUTH_KEY);
      if (loggedInUser) {
        const parsed = JSON.parse(loggedInUser);
        this.loggedInUser = parsed;
      }
    }
  }

  show() {
    this.loadingSub.next(true);
  }

  hide() {
    this.loadingSub.next(false);
  }

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
