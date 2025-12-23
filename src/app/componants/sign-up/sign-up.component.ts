import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  messageAr = '';
  messageEn = '';
  constructor(private authService: AuthService, private routes: Router) { }

  ngOnInit(): void {
  }

  createAccount(username, password, email , confirmPassword) {
    if (!this.validateAccount(username, password, email, confirmPassword)) {
      setTimeout(() => {
          this.messageAr = '';
          this.messageEn = '';
        },

        3000);

      return;
    }
    this.authService.createAccount(username, email, password).subscribe(
      response => {
        this.messageAr = 'تم إنشاء الحساب، يرجى تسجيل الدخول';
        this.messageEn = 'Account created successfully, please login';
        setTimeout(() => {
          this.messageAr = '';
          this.messageEn = '';
          this.routes.navigateByUrl('/login');
        }, 3000);

      }, error => {
        this.messageAr = error.error.bundleMessage.ar;
        this.messageEn = error.error.bundleMessage.en;
        setTimeout(() => {
            this.messageAr = '';
            this.messageEn = '';
          },

          3000);

      }
    );

  }
  validateAccount(username, password, email , confirmPassword): boolean {
    if (!username) {
      this.messageAr = 'اسم المستخدم مطلوب';
      this.messageEn = 'username is required';
      return false;
    }

    if (!password) {
      this.messageAr = 'كلمة السر مطلوبة';
      this.messageEn = 'password is required';
      return false;
    }
    if(!email){
      this.messageAr = 'البريد الالكتروني مطلوب';
      this.messageEn = 'email is required';
      return false;
    }
    if (!confirmPassword) {
      this.messageAr = 'برجاء تأكيد كلمة السر';
      this.messageEn = 'please confirm your password';
      return false;
    }
    if (password !== confirmPassword) {
      this.messageAr = 'كلمة السر لا تتوافق';
      this.messageEn = 'confirmed password does not match password';
      return false;
    }

    return true;


  }
}
