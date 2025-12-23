import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  private baseUrl = 'http://localhost:9090/action';

  constructor(private http: HttpClient) { }

  getTopFiveActions(): Observable<any>{
   return  this.http.get<any>(this.baseUrl + '/top5Actions').pipe(
      map(
        response => response
      )
    );
  }
  getFriendActions(accountId:number){
    return  this.http.get<any>(this.baseUrl + '/getFriendAction?accountId=' + accountId).pipe(
      map(
        response => response
      )
    );
  }
}
