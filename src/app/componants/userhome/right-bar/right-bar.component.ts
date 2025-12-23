import { Component, OnInit } from '@angular/core';
import {Account} from '../../../../model/account';
import {FriendRequest} from '../../../../model/friend-request';
import {FriendRequestService} from '../../../../services/friend-request.service';
import {SearchService} from '../../../../services/search.service';

@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.css']
})
export class RightBarComponent implements OnInit {


friendRequest: Account[] = [];
messageAr = '';
messageEn = '';

  currentLoadingId: number | null = null;
  constructor(private friendRequestService: FriendRequestService , private searchService: SearchService, ) { }

  ngOnInit(): void {
    this.searchService.currentResults.subscribe(

      result => {


        if (result === null) {
        console.log('search cleared loading who to follow');
        this.friendRequest = [];
        this.getWhoToFollow();

        } else {

         this.friendRequest = result.accounts;
       }

      }
    );

  }

  getWhoToFollow(): void {
    this.friendRequestService.getWhoToFollow().subscribe(
      response => {
        this.friendRequest = response;
      }, error => {
        this.messageAr = error.error.bundleMessage.ar;
        this.messageEn = error.error.bundleMessage.en;
      }
    );
  }

  resolveImageUrl(picUrl: string): string {
    if (picUrl) {

      return `assets/images/${picUrl}`;
    }
    return 'assets/images/users/user-1.jpg';
  }


  addFriend(receiverId: number): void {
    this.currentLoadingId = receiverId;
    this.messageEn = 'Sending...';
    this.messageAr = 'جاري الإرسال...';
    this.friendRequestService.sendFriendRequest(receiverId).subscribe(

      response => {
        this.messageEn = 'sent!';
        this.messageAr = 'تم الارسال!';
        setTimeout(() => {

          this.friendRequest = this.friendRequest.filter(user => user.id !== receiverId);

          this.currentLoadingId = null;
          this.messageEn = '';
          this.messageAr = '';
        }, 3000);
      }, error => {
        this.messageAr = error.error.bundleMessage.ar;
        this.messageEn = error.error.bundleMessage.en;
        setTimeout(() => {
          this.currentLoadingId = null;

        }, 3000);
      }


    );

  }
}

