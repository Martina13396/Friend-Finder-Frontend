import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Comments} from "../model/comments";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
   private baseUrl = 'http://localhost:9090/comment';
  constructor(private http: HttpClient) { }

  addComment(comments: any): Observable<any> {
    return this.http.post<Comment>(this.baseUrl + '/add', comments).pipe(
      map(
        response => response
      )
    );
  }

  getComments(postId: any): Observable<any> {
    return this.http.get<Comment[]>(this.baseUrl + '/getComments?postId=' + postId).pipe(
      map(
        response=> response
      )
    );
  }
  deleteComment(commentId: any) {
    return this.http.delete(this.baseUrl + '/deleteComment?commentId=' + commentId).pipe(
      map(
        response => response
      )
    );
  }
}
