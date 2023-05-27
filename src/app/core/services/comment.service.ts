import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, tap } from 'rxjs';
import { handleError } from '../errorHandling/errorHandler';
import { Comment } from '../models/comment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient, 
              private authService: AuthService){}

  private baseUrl = this.authService.baseUrl;

  commentSuccess = new Subject();

  comments$ = this.http.get<Comment[]>(`${this.baseUrl}comments`).pipe(
    map(comments => comments.filter(comment => comment.status == 'a')),
    catchError(handleError)
  )
  
  getCurriculumComments(id: number){
    return this.http.get<Comment[]>(`${this.baseUrl}comments`).pipe(
      map(comments => comments.filter(comment => comment.curriculum_id == id)),
      catchError(handleError)
    )
  }
  getRevisionComments(id: number){
    return this.http.get<Comment[]>(`${this.baseUrl}comments`).pipe(
      map(comments => comments.filter(comment => comment.curriculum_revision_id == id)),
      catchError(handleError)
    )
  }
  addComment(data:any){
    return this.http.post<Comment>(`${this.baseUrl}comments`, data).pipe(
      tap(data => this.commentSuccess.next('success'))
    )
  }

  editComment(id: number, body: any){
    return this.http.patch<Comment>(`${this.baseUrl}comments/${id}`, {...body, id: id}).pipe(
      tap(data => this.commentSuccess.next('success'))
    )
  }

  deleteComment(id: number){
    return this.http.patch<Comment>(`${this.baseUrl}comments/${id}`, {status: 'i', id: id})
  }
}
