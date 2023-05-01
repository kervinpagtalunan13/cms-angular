import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { catchError, tap } from 'rxjs';
import { handleError } from '../errorHandling/errorHandler';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = this.authService.baseUrl;

  constructor(private http: HttpClient,
              private authService: AuthService) {}

  users$ = this.http.get<User[]>(`${this.baseUrl}users`);

  updateCurrentUser(profile: any){
    const currentUser = this.authService.currentUser
    
    if(!currentUser.profile){
      const credentials = {...profile, userId: currentUser.id}
      return this.http.post(`${this.baseUrl}profiles`, credentials).pipe(
        catchError(handleError)
      )
    }
    const credentials = {...profile, userId: currentUser.profile.id}
    return this.http.patch(`${this.baseUrl}profiles/${currentUser.profile.id}`, credentials).pipe(
      catchError(handleError)
    )
  }

  changePass(passwords: any){
    return this.http.post(`${this.baseUrl}users/changePass`, passwords).pipe(
      catchError(handleError)
    )
  }

  onUpload(fd: FormData) {
    return this.http.post(`${this.baseUrl}profiles/upload`, fd).pipe(
      catchError(handleError)
    )

    // .subscribe(response => {
    //   console.log(response);
    // });
    // console.log(fd)
  }
}
