import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { handleError } from '../errorHandling/errorHandler';
import { Content } from '../models/content.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private http: HttpClient, 
              private authService: AuthService){}
              
  private baseUrl = this.authService.baseUrl;

  private contentSubject = new BehaviorSubject<Content | null | any>(null);
  contentAction$ = this.contentSubject.asObservable()

  content$ = this.http.get<Content>(`${this.baseUrl}contents`).pipe(
    tap(data => {
      this.contentSubject.next(data)
    }),
    catchError(handleError)
  )
  
  updateContent(data:any){
    return this.http.post<Content>(`${this.baseUrl}content`, data).pipe(
      tap(data => {        
        this.contentSubject.next(data)
      }),
      catchError(handleError)
    )
  }

  addContent(data:any){
    return this.http.post<Content>(`${this.baseUrl}content-init`, data).pipe(
      tap(data => {        
        this.contentSubject.next(data)
      }),
      catchError(handleError)
    )
  }
}
