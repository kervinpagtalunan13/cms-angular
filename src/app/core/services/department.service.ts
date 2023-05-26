import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { handleError } from '../errorHandling/errorHandler';
import { Department } from '../models/department';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  constructor(private http: HttpClient, 
              private authService: AuthService){}

  private baseUrl = this.authService.baseUrl;

  departments$ = this.http.get<Department[]>(`${this.baseUrl}departments`).pipe(
    catchError(handleError)
  )
  departments2$ = this.http.get<Department[]>(`${this.baseUrl}departmentsList`).pipe(
    catchError(handleError)
  )
}
