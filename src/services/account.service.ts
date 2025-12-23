import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";
import {Account} from "../model/account";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
private baseUrl = 'http://localhost:9090/api/account';
  constructor(private http: HttpClient) { }

  getAccountByEmail(email: string):Observable<Account> {

    return this.http.get<Account>(this.baseUrl + '/getByEmail?email=' + email).pipe(
      map(
        response => response
      )
    );
  }
}
