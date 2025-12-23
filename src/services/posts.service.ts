import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post} from '../model/post';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  newPostSubject = new Subject<Post>();

  private baseUrl = 'http://localhost:9090/posts';

  constructor(private http: HttpClient) { }


  createPost(formData: FormData): Observable<any>{
    return this.http.post<any>(this.baseUrl + '/createPost' , formData).pipe(
      map(
        response => response
      )
    );
  }

  getPostsForUserAndFriends(): Observable<any>{
    return this.http.get<any>(this.baseUrl + '/getPosts').pipe(
      map(
        response => response
      )
    );
  }

  getPostsByAccountId(): Observable<any>{
    return this.http.get<any>(this.baseUrl + '/getUserPosts').pipe(
      map(
        response => response
      )
    );
  }
  deletePost(postId:number , viewType:string):Observable<any>{
    return this.http.put<Post>(this.baseUrl + '/deletePost?postId=' + postId + '&viewType=' + viewType, {} ).pipe(
      map(
        response => response
      )
    );
  }
  getMedia():Observable<any>{
    return this.http.get<any>(this.baseUrl + '/getMedia').pipe(
      response=>response
    );
  }

  getFriendAlbum(accountId:number):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/getFriendAlbum?accountId=' + accountId).pipe(
      map(
        response => response
      )
    );
  }
  getFriendPosts(accountId:number):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/getFriendPosts?accountId=' + accountId).pipe(
      map(
        response => response
      )
    );
  }
}
