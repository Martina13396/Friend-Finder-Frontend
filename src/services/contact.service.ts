import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {Contact} from '../model/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl = 'http://localhost:9090/contact';
  constructor(private http: HttpClient) { }


  saveContact(contact: Contact):Observable<any> {
   return  this.http.post<any>(`${this.baseUrl}/save`, contact).pipe(
      map(
        response => response
      )
    );
  }
}
