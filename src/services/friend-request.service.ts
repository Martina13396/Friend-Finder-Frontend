import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FriendRequestService {
private baseUrl = 'http://localhost:9090/friendRequest';
  constructor(private http: HttpClient) { }
  public notificationCount = new BehaviorSubject<number>(0);
  sendFriendRequest(receiverId: number): Observable<any>{
    return this.http.post<any>(this.baseUrl + '/sendRequest' , receiverId).pipe(
      map(
        response => response
      )
    );
  }
  acceptFriendRequest(requestId: number): Observable<any>{
    return this.http.post<any>(this.baseUrl + '/acceptRequest?requestId=' + requestId ,{}).pipe(
      map(
        response => response
      )
    );
  }
   rejectFriendRequest(requestId: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/rejectRequest?requestId=' + requestId);
 }
 getFriendRequestsForUser(): Observable<any>{
    return this.http.get<any>(this.baseUrl + '/getFriendRequests').pipe(
      map(
        response => response
      )
    );
 }

 getFriendsForUser(): Observable<any>{
    return this.http.get<any>(this.baseUrl + '/getFriends').pipe(
      map(
        response => response
      )
    );
 }
 getWhoToFollow(): Observable<any>{
    return this.http.get<any>(this.baseUrl + '/getWhoToFollow').pipe(
      map(
        response => response
      )
    );
 }
 getFriendsByAccountId(accountId: number): Observable<any>{
    return this.http.get<any>(this.baseUrl + '/getFriendsByAccountId?accountId=' + accountId).pipe(
      map(
        response => response
      )
    );
 }

 getAcceptedNotification(): Observable<any>{
    return this.http.get<any>(this.baseUrl + '/acceptedNotification').pipe(
      map(
        response => response
      )
    );

 }
 getRequestsForSender():Observable<any>{
    return this.http.get<any>(this.baseUrl + '/requestForSender').pipe(
      map(
        response => response
      )
    );
 }
 markRead(accountId:number):Observable<any>{
    return  this.http.put<any>(this.baseUrl + '/markRead',accountId).pipe(
      map(
        response => response
      )
    );
 }
 getAcceptedCount(){
    return this.http.get<any>(this.baseUrl + '/getAcceptedCount').pipe(
      map(
        response => response
      )
    );
 }
 getUnreadRequests(){
    return this.http.get<any>(this.baseUrl + '/getUnreadRequests').pipe(
      map(
        response => response
      )
    );
 }
}
