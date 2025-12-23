import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from "@angular/router";
import {FriendRequestService} from "../../../services/friend-request.service";
import {BehaviorSubject, Subject, Subscription} from "rxjs";
import {SearchService} from "../../../services/search.service";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {Search} from "../../../model/search";
import {query} from "@angular/animations";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  private searchSubject = new Subject<string>();
  private searchSub?:Subscription;

  constructor(private authService: AuthService , private router: Router , private friendRequestService: FriendRequestService
       ,      private searchService: SearchService) { }
  incomingCount = 0;
  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(
     query => {
       this.searchService.globalSearch(query);
     }
    );

    this.friendRequestService.notificationCount.subscribe(
      count => {
        this.incomingCount = count;
      }
    );

    this.loadIncomingCount();
  }


  isUserLogin(): boolean {
    return this.authService.isUserLogin();
  }


 loadIncomingCount(): void {
   this.friendRequestService.getUnreadRequests().subscribe(
     incoming => {
       this.friendRequestService.getAcceptedCount().subscribe(
         notification => {
           this.incomingCount = notification + incoming;
           console.log('Total Notifications:', this.incomingCount);
         });
     }
   );

 }
 onSearch(event: any) {
   const value = event.target.value;


   if (!value || value.trim() === '') {
     this.searchService.globalSearch('');


     window.location.reload();

   } else {

     this.searchSubject.next(value);
   }
 }


  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }


}
