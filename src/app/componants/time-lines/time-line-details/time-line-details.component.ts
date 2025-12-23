import { Component, OnInit } from '@angular/core';
import {ActionService} from '../../../../services/action.service';
import {Action} from '../../../../model/action';
import {Account} from "../../../../model/account";
import {AccountService} from "../../../../services/account.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-time-line-details',
  templateUrl: './time-line-details.component.html',
  styleUrls: ['./time-line-details.component.css']
})
export class TimeLineDetailsComponent implements OnInit {

  actions: Action[] = [];
  userData: Account;
  accountId: number;

  constructor(private actionService: ActionService,private accountService: AccountService
  ,           public authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const loggedInId = this.authService.getAccountId();
    const loggedInEmail = this.authService.getEmail();

    this.route.paramMap.subscribe(params => {
      const emailByUrl = params.get('email');
      if (!emailByUrl || emailByUrl === loggedInEmail) {
        this.accountService.getAccountByEmail(loggedInEmail).subscribe(account => {
          this.accountId = loggedInId;
          this.userData = account;
          this.getActions();
        });

      }else{
        this.accountService.getAccountByEmail(emailByUrl).subscribe(account => {
          this.accountId = account.id;
          this.userData = account;
          this.getFriendActions(this.accountId);
        });
      }
    });
  }

  getActions(): void {
    this.actionService.getTopFiveActions().subscribe(
      res => {
        this.actions = res;

        this.actions.forEach(action => {
          action.timeAgo = this.calculateTimeAgo(action.createdAt);
        });
      }
    );
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

  getFriendActions(accountId:number){
    this.actionService.getFriendActions(accountId).subscribe(
      res => {
        this.actions = res;
        this.actions.forEach(action => {
          action.timeAgo = this.calculateTimeAgo(action.createdAt);
        });
      }
    );
  }
}
