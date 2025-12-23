import { Component, OnInit } from '@angular/core';
import {FriendRequestService} from "../../../../services/friend-request.service";
import {Account} from "../../../../model/account";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  friends: Account[] = [];
  messageAr = '';
  messageEn ='';

  constructor(private friendService:FriendRequestService) { }

  ngOnInit(): void {
    this.getFriends();
  }


  getFriends(): void {

    this.friendService.getFriendsForUser().subscribe(
      result => {
        this.friends = result;




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


}
