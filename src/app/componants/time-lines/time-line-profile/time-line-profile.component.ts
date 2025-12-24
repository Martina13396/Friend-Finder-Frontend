
import {Post} from '../../../../model/post';
import {Comments} from '../../../../model/comments';
import {PostsService} from '../../../../services/posts.service';
import {AuthService} from '../../../../services/auth.service';
import {CommentsService} from '../../../../services/comments.service';
import {ReactsService} from '../../../../services/reacts.service';
import { Component, OnInit, Input } from '@angular/core';
import {Account} from '../../../../model/account';
import {AccountService} from '../../../../services/account.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FriendRequestService} from "../../../../services/friend-request.service";
import {FriendRequest} from "../../../../model/friend-request";


@Component({
  selector: 'app-time-line-profile',
  templateUrl: './time-line-profile.component.html',
  styleUrls: ['./time-line-profile.component.css']
})

export class TimeLineProfileComponent implements OnInit {

   account: Account;
   email: string;
   friendRequest:Account[] = [];
  incomingRequests: FriendRequest[] = [];
  sentRequests: FriendRequest[] = [];
  currentUserId:number;

  accountId:number;
  acceptedFriends: Account[] = [];

  currentLoadingId: number | null = null;
  messageAr = '';
  messageEn = '';
  @Input() userData: Account;
  constructor(private accountService:AccountService, private authService:AuthService , private activatedRoute: ActivatedRoute
,             private friendRequestService:FriendRequestService) { }

  ngOnInit(): void {

    this.currentUserId = this.authService.getAccountId();
    const loggedInEmail = this.authService.getEmail();
    this.getFriendsForcurrentAccount();
    this.loadSentRequests();
    this.activatedRoute.paramMap.subscribe(
       params => {
         const emailByUrl = params.get('email');
         if (!emailByUrl || emailByUrl === loggedInEmail) {
           this.accountService.getAccountByEmail(loggedInEmail).subscribe(
           account=>{
             this.accountId = this.currentUserId;
             this.userData = account;


             }
           );
         }else {
           this.accountService.getAccountByEmail(emailByUrl).subscribe(
             account=>{
               this.userData = account;
               this.accountId = account.id;


             }
           );
         }
       }
     );




  }

  loadAcceptedFriends(): void {

  }
  isAlreadyFriend(userId: number): boolean {
    return this.acceptedFriends.some(f => f.id === userId);
  }

  loadSentRequests(): void {
    this.friendRequestService.getRequestsForSender().subscribe(requests => {
      this.sentRequests = requests;
    });
  }
  addFriend(receiverId: number): void {
    if (!receiverId) {
      console.error('No receiver ID found!');
      return;
    }
    this.currentLoadingId = receiverId;
    this.messageEn = 'Sending...';
    this.messageAr = 'جاري الإرسال...';
    this.friendRequestService.sendFriendRequest(receiverId).subscribe(

      response => {
        this.sentRequests = [...this.sentRequests, response];

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


  deleteRequest(requestId: number) {
    this.friendRequestService.rejectFriendRequest(requestId).subscribe(() => {
      this.incomingRequests = this.incomingRequests.filter(req => req.id !== requestId);
      this.sentRequests = this.sentRequests.filter(req => req.id !== requestId);
      this.messageEn = '';
    });
  }

  isRequested(userId: number): boolean {
    return this.sentRequests.some(req => req.receiver.id === userId);
  }
  getReqId(userId: number): number {
    const req = this.sentRequests.find(r => r.receiver.id === userId);
    return req ? req.id : 0;
  }
  isOwnProfile(): boolean {
    return this.userData && this.currentUserId === this.userData.id;
  }

  getFriendsForcurrentAccount(){
    this.friendRequestService.getFriendsForUser().subscribe(
      friends => {
        this.acceptedFriends = friends;
      }
    );
  }
}
