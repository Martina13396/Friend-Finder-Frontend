import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from "rxjs";
import {Search} from "../model/search";
import {catchError, switchMap} from "rxjs/operators";
import {query} from "@angular/animations";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  lastQuery = '';
  private baseUrl = 'http://localhost:9090/search';

private searchResultsSource = new BehaviorSubject<Search|null>(null);
currentResults = this.searchResultsSource.asObservable();
  constructor(private http: HttpClient) {
  }

  globalSearch(query: string): void {
    this.lastQuery = query;

    if (!query.trim()) {
      this.lastQuery = '';
      this.searchResultsSource.next(null);
      return;
    }

    this.http.get<Search>(this.baseUrl + '/global?query=' + query).subscribe(
      data => {


        this.searchResultsSource.next(data);
      }
    );
  }
}
