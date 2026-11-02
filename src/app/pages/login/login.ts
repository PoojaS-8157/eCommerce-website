import { Component, inject } from '@angular/core';
import { UserLogin } from '../../service/user-login';
import { ILoginUser, RegisterUser } from '../../model/user.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { constants } from '../../constant/Constant';
import { GlobalDialogService } from '../../global-dialog.service';

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
  dialogService = inject(GlobalDialogService);
  registerUser: RegisterUser = new RegisterUser(0, '', '', '');
  loginUser: ILoginUser = { UserName: '', UserPassword: '' };

  toggleFormVisibility(): void {  
    this.isLoginFormVisible = !this.isLoginFormVisible;
  }

  OnRegisterUser(): void {
    this.userService.registerUser(this.registerUser).subscribe({
      next: (response) => {
        this.dialogService.open({
          title: 'Registration successful',
          message: response?.message || 'Your account was created successfully.',
          type: 'success',
        });
      },
      error: (error) => {
        this.dialogService.open({
          title: 'Registration failed',
          message: error?.message || 'Unable to register your account right now.',
          type: 'error',
        });
      }
    });
 }
  OnLoginUser(): void {
    this.userService.loginUser(this.loginUser).subscribe({
      next: (response) => {
        if (response.result) {
          localStorage.setItem(constants.LOGIN_AUTH_KEY, JSON.stringify(response.data));
          this.userService.userLoggedIn.next();
          this.userService.readUsersData();
          this.dialogService.open({
            title: 'Login successful',
            message: response?.message || 'Welcome back!',
            type: 'success',
          });
          this.router.navigateByUrl('/home');
        } else {
          this.dialogService.open({
            title: 'Login failed',
            message: response?.message || 'Invalid username or password.',
            type: 'error',
          });
        }
      },
      error: (error) => {
        this.dialogService.open({
          title: 'Login failed',
          message: error?.message || 'Unable to log in right now.',
          type: 'error',
        });
      }
    });
  }
}
