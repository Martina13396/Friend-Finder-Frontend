import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Reacts} from '../model/reacts';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReactsService {
  private baseUrl = 'http://localhost:9090/reacts';
  constructor(private http: HttpClient) { }


  toggleReacts(reactType , postId): Observable<any>{

    const body = {reactType, postId};

    return this.http.post<Reacts>(this.baseUrl + '/toggleReact', body).pipe(
      map(
        response => response
      )
    );
  }

  countReacts(postId: number ): Observable<any>{
    return this.http.get<Reacts>(this.baseUrl + '/count?postId=' + postId + '&reactType=' ).pipe(
      map(
        response => response
      )
    );
  }
}
