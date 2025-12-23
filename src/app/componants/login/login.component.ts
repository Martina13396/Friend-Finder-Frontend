import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  messageAr = '';
  messageEn = '';
  constructor(private authService: AuthService, private routes: Router) { }

  ngOnInit(): void {
  }
  login(email, password): void {

    if (!this.validateAccount(email, password)) {
      setTimeout(() => {
          this.messageAr = '';
          this.messageEn = '';
        },

        3000);

      return;
    }

    this.authService.login(email, password).subscribe(
    response => {
  sessionStorage.setItem('token', response.token);
  sessionStorage.setItem('roles', response.userRoles);
  window.location.href = '/mainpage';
}, error => {
      this.messageAr = error.error.bundleMessage.ar;
      this.messageEn = error.error.bundleMessage.en;
      setTimeout(() => {
    this.messageAr = '';
    this.messageEn = '';
  }, 3000);

}
);

}
  validateAccount(email, password): boolean {
    if (!email) {
      this.messageAr = 'البريد الالكتروني مطلوب';
      this.messageEn = 'email is required';
      return false;
    }

    if (!password) {
      this.messageAr = 'كلمة السر مطلوبة';
      this.messageEn = 'password is required';
      return false;
    }
    return true;
  }

}
