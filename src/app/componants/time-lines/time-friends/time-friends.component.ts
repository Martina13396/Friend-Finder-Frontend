import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FriendRequestService} from '../../../../services/friend-request.service';
import {FriendRequest} from "../../../../model/friend-request";
import {AuthService} from "../../../../services/auth.service";
import {Account} from "../../../../model/account";
import {ActivatedRoute} from "@angular/router";
import {PostsService} from "../../../../services/posts.service";
import {AccountDetailsService} from "../../../../services/account-details.service";
import {AccountService} from "../../../../services/account.service";

@Component({
  selector: 'app-time-friends',
  templateUrl: './time-friends.component.html',
  styleUrls: ['./time-friends.component.css']
})
export class TimeFriendsComponent implements OnInit {
  friendRequests: FriendRequest[] = [];
  messageAr = '';
  messageEn = '';
  accountId: number;
  userData: Account;


  constructor(private friendRequestService: FriendRequestService, private authService: AuthService
  ,           private cdr: ChangeDetectorRef , private route: ActivatedRoute

  ,           private accountService:AccountService) {
  }

  ngOnInit(): void {
    const loggedUserId = this.authService.getAccountId();

    this.route.paramMap.subscribe(params => {
      const emailFromUrl = params.get('email');

      if (emailFromUrl) {
        this.accountService.getAccountByEmail(emailFromUrl).subscribe(account => {
          this.accountId = account.id;
          this.userData = account;
          this.getFriendsByAccountId(this.accountId);
        });
      }else {
        this.accountService.getAccountByEmail(this.authService.getEmail()).subscribe(account => {
          this.accountId = loggedUserId;
          this.userData = account;
          this.getFriends();
        });
      }
    });


  }


getFriends(): void {

this.friendRequestService.getFriendsForUser().subscribe(
  result => {
    this.friendRequests = result;




      }, error => {
        this.messageAr = error.error.bundleMessage.ar;
        this.messageEn = error.error.bundleMessage.en;
      }
    );

  }

  resolveImageUrl(url: string, type: 'user' | 'cover'): string {
    if (!url) {
      return 'assets/images/default-avatar.png';
    }

    if (url.includes('users/') || url.includes('covers/')) {
      return 'assets/images/' + url;
    }

    return `http://localhost:9090/uploads/${url}`;
  }

  getFriendsByAccountId(accountId: number) {
    this.friendRequestService.getFriendsByAccountId(accountId).subscribe(
      result => {
        this.friendRequests = result;
      },error => {
        this.messageAr = error.error.bundleMessage.ar;
        this.messageEn = error.error.bundleMessage.en;
      }
    );
  }

}
