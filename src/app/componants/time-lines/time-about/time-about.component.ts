import { Component, OnInit } from '@angular/core';
import {AccountDetails} from '../../../../model/account-details';
import {AccountDetailsService} from '../../../../services/account-details.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Account} from "../../../../model/account";
import {AuthService} from "../../../../services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {AccountService} from "../../../../services/account.service";

@Component({
  selector: 'app-time-about',
  templateUrl: './time-about.component.html',
  styleUrls: ['./time-about.component.css']
})
export class TimeAboutComponent implements OnInit {

  accountDetails: AccountDetails;
  messageAr = '';
  messageEn = '';
  userData:Account;
  accountId: number;

  constructor(private accountDetailsService: AccountDetailsService , private sanitizer: DomSanitizer
          ,   private authService: AuthService, private route: ActivatedRoute , private accountService:AccountService) { }

  ngOnInit(): void {
    const loggedUserId = this.authService.getAccountId();
    const loggedInEmail = this.authService.getEmail();
    this.route.paramMap.subscribe(params => {
      const emailFromUrl = this.route.snapshot.paramMap.get('email');

      if (!emailFromUrl || emailFromUrl === loggedInEmail) {

        this.accountService.getAccountByEmail(this.authService.getEmail()).subscribe(account => {
          this.accountId = loggedUserId;
          this.userData = account;
          this.getAccountDetails();

        });

      } else {
        this.accountService.getAccountByEmail(emailFromUrl).subscribe(account => {
          this.accountId = account.id;
          this.userData = account;
          this.getFriendDetails(this.accountId);
        });
      }
    });
  }


  getAccountDetails(){
    this.accountDetailsService.getAccountDetails().subscribe(
      response => {
        this.accountDetails = response;
      },error => {
        this.messageAr = error.errors.bundleMessage.ar;
        this.messageEn = error.errors.bundleMessage.en;
      }
    );
  }
  updateAccountDetails(accountDetails: AccountDetails): void {
    this.accountDetailsService.updateAccountDetails(accountDetails).subscribe(
      response => {
        this.accountDetails = response;
        this.messageAr = 'تم تحديث البيانات بنجاح';
        this.messageEn = 'Details were updated successfully.';
        setTimeout(
          ()=> {
            this.messageAr = '';
            this.messageEn = '';
          }, 3000
        );
      },error => {
        this.messageAr = error.errors.bundleMessage.ar;
        this.messageEn = error.errors.bundleMessage.en;
      }
    );
  }

  getMapUrl(location: string): SafeResourceUrl {
    const url = `https://maps.google.com/maps?q=${location}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  addLanguage() {
    this.accountDetails.languages.push({ language: '', level: 'Beginner' });
  }


  addWorkExperience() {
    this.accountDetails.workExperiences.push({ companyName: '', title: '', startDate: '', endDate: '', present: false,
      companyLogo: ''
    });
  }


  addFavorite() {
    this.accountDetails.favorites.push({ favorite: '' });
  }

  getFriendDetails(accountId: number) {
    this.accountDetailsService.getFriendDetails(accountId).subscribe(
      response => {
        this.accountDetails = response;

      },error => {
        this.messageAr = error.errors.bundleMessage.ar;
        this.messageEn = error.errors.bundleMessage.en;
      }
    );
  }
}
