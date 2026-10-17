import { Component, inject } from '@angular/core';
import { UserLogin } from '../../service/user-login';
import { ILoginUser, RegisterUser } from '../../model/user.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { constants } from '../../constant/Constant';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  isLoginFormVisible = true;
  userService = inject(UserLogin);
  router = inject(Router);
  registerUser: RegisterUser = new RegisterUser(0, '', '', '');
  loginUser: ILoginUser = { UserName: '', UserPassword: '' };

  toggleFormVisibility(): void {
    this.isLoginFormVisible = !this.isLoginFormVisible;
  }

  OnRegisterUser(): void {
    this.userService.registerUser(this.registerUser).subscribe({
      next: (response) => {
        alert(response.message);
      },
      error: (error) => {
        alert(error.message);
      }
    });
 }
  OnLoginUser(): void {
    this.userService.loginUser(this.loginUser).subscribe({
      next: (response) => {
        if (response.result) {
          localStorage.setItem(constants.LOGIN_AUTH_KEY, JSON.stringify(response.data));
          this.userService.userLoggedIn.next();
          alert(response.message);
          this.router.navigateByUrl('/home');
        } else {
          alert(response.message);
        }
      },
      error: (error) => {
        alert(error.message);
      }
    });
  }
}
