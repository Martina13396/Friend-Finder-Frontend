import { Component, OnInit } from '@angular/core';
import {Account} from '../../../../model/account';
import {AccountService} from '../../../../services/account.service';
import {AuthService} from '../../../../services/auth.service';
import {FriendRequestService} from '../../../../services/friend-request.service';
import {FriendRequest} from '../../../../model/friend-request';

@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.css']
})
export class LeftBarComponent implements OnInit {

userData:Account;
friendList:Account[] = [];
userEmail: string;

  constructor(private accountService:AccountService, private authService: AuthService , private friendService:FriendRequestService) { }

  ngOnInit(): void {
    this.userEmail = this.authService.getEmail();
    this.accountService.getAccountByEmail(this.userEmail).subscribe(
      result => {
        this.userData=result;
        this.getFriends();
      }
    );
  }

  getFriends():void {
    this.friendService.getFriendsForUser().subscribe(
      result => {
        this.friendList=result;
      }
    );
  }

  getFriendAccount(request: FriendRequest): Account {

    if (request.sender.email === this.userEmail) {
      return request.receiver;
    }

    return request.sender;
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


}
