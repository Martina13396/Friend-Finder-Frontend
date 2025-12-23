import { Component, OnInit } from '@angular/core';
import {FriendRequest} from "../../../model/friend-request";
import {FriendRequestService} from "../../../services/friend-request.service";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.css']
})
export class FriendRequestsComponent implements OnInit {

  incomingRequests: FriendRequest[] = [];
  sentRequests: FriendRequest[] = [];
  acceptedRequests: FriendRequest[] = [];
  accountId:number;


  constructor(private requestService: FriendRequestService , private authService: AuthService) {
  }

  ngOnInit(): void {
  this.accountId = this.authService.getAccountId();

  this.requestService.markRead(this.accountId).subscribe({
    next: () => {
      this.requestService.notificationCount.next(0);
    }
  });

  this.loadData();
  }

  loadData(): void {
    this.requestService.getFriendRequestsForUser().subscribe(
      (res: FriendRequest[]) => {
        this.incomingRequests = res;
        this.incomingRequests.forEach(request => {
          request.timeAgo = this.calculateTimeAgo(request.createdAt);
        });
      }
    );
    this.requestService.getRequestsForSender().subscribe(
      (res: FriendRequest[]) => {
        this.sentRequests = res;
      }
    );
    this.requestService.getAcceptedNotification().subscribe(
      (res: FriendRequest[]) => {
        this.acceptedRequests = res;
      }
    );
  }

  accept(requestId: number): void {
    this.requestService.acceptFriendRequest(requestId).subscribe(
      () => {
        this.incomingRequests = this.incomingRequests.filter(req => req.id !== requestId);
        this.sentRequests = this.sentRequests.filter(req => req.id !== requestId);
      }
    );
  }

  deleteRequest(requestId: number) {
    this.requestService.rejectFriendRequest(requestId).subscribe(() => {
      this.incomingRequests = this.incomingRequests.filter(req => req.id !== requestId);
      this.sentRequests = this.sentRequests.filter(req => req.id !== requestId);
    });
  }
  calculateTimeAgo(createdDate: string): string {
    const now = new Date();
    const created = new Date(createdDate);


    if (isNaN(created.getTime())) {
      return 'Unknown time';
    }

    const diffMs = now.getTime() - created.getTime();
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 60) {
      return diffSecs <= 0 ? `Just now` : `${diffSecs} sec ago`;
    }

    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) {
      return `${diffMins} min ago`;
    }

    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) {
      return `${diffHrs} hr ago`;
    }

    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 30) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }


    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    }

    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  }


}
