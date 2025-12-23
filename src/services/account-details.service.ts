import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {AccountDetails} from "../model/account-details";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AccountDetailsService {

  private baseUrl = 'http://localhost:9090/accountDetails';

  constructor(private http: HttpClient) { }

  getAccountDetails():Observable<any> {
    return this.http.get<AccountDetails>(this.baseUrl + '/about').pipe(
      map(
        response => response
      )
    );
  }

  updateAccountDetails(accountDetails: AccountDetails): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/updateDetails', accountDetails).pipe(
      map(
        response => response
      )
    );
  }
  getFriendDetails(accountId:number):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/getFriendDetails?accountId=' +accountId).pipe(
      map(
        response => response
      )
    );
  }
}
