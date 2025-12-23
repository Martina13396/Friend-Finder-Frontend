import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:9090/auth';

  constructor(private http: HttpClient) { }

  createAccount(name , email, password ): Observable<any>{

    return this.http.post<any>( this.baseUrl + '/sign-up' , {name, password , email}).pipe(
      map(
        response => response
      )
    );
  }

  login(email , password):Observable<any>{
    return this.http.post<any>(this.baseUrl + '/login' , {email , password}).pipe(
      map(
        response => {
          const accountIdFromResponse = response.accountId;

          if (accountIdFromResponse) {
            const accountIdString = accountIdFromResponse.toString();

            sessionStorage.setItem('token', response.token);

            sessionStorage.setItem('roles', response.roles);

            if(response.profilePictureUrl) {
              sessionStorage.setItem('profilePictureUrl', response.profilePictureUrl);

            }

            sessionStorage.setItem('accountId', accountIdString);
            sessionStorage.setItem('email', email);

          }
          return response;
        }
      )
    );
  }
  isUserLogin(): boolean{
    return sessionStorage.getItem('token') != null
      && sessionStorage.getItem('token') != undefined;
  }
  logout(): void{
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('roles');
    sessionStorage.removeItem('accountId');
  }

  getAccountId(): number | null{
    const id = sessionStorage.getItem('accountId');
    if (id){
      const accountId = parseInt(id , 10);
      if (!isNaN(accountId)){
        return accountId;
      }
    }
    return null;
  }

  getCurrentAccountProfilePic(): string|null{
    return sessionStorage.getItem('profilePictureUrl');
  }
getEmail(): string|null{
    return sessionStorage.getItem('email');
}
}
